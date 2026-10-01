import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  certificadosApi,
  inscripcionesApi,
  participantesApi,
  cursosApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  inscripcion_id: "",
  codigo_certificado: "",
  fecha_emision: "",
  estado_certificado: "GENERADO",
};


const textoSeguro = (valor) => {

  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  return String(valor);
};


const obtenerFechaActual = () => {

  const hoy =
    new Date();

  const anio =
    hoy.getFullYear();

  const mes =
    String(
      hoy.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const dia =
    String(
      hoy.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${anio}-${mes}-${dia}`;
};


export default function CertificadosPage() {

  const [
    certificados,
    setCertificados,
  ] = useState([]);

  const [
    inscripciones,
    setInscripciones,
  ] = useState([]);

  const [
    participantes,
    setParticipantes,
  ] = useState([]);

  const [
    cursos,
    setCursos,
  ] = useState([]);

  const [
    formulario,
    setFormulario,
  ] = useState(
    formularioInicial
  );

  const [
    editandoId,
    setEditandoId,
  ] = useState(null);

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    mensaje,
    setMensaje,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    cargarDatos();

  }, []);


  const obtenerMensajeError = (
    err,
    mensajeDefecto
  ) => {

    const detail =
      err.response?.data?.detail;


    if (
      typeof detail === "string"
    ) {
      return detail;
    }


    if (
      Array.isArray(detail)
    ) {

      return detail
        .map(
          (item) =>
            item?.msg ||
            JSON.stringify(item)
        )
        .join(" | ");
    }


    return mensajeDefecto;
  };


  const cargarDatos =
    async () => {

      setCargando(true);
      setError("");


      try {

        const [
          respuestaCertificados,
          respuestaInscripciones,
          respuestaParticipantes,
          respuestaCursos,
        ] = await Promise.all([

          certificadosApi.listar(),

          inscripcionesApi.listar(),

          participantesApi.listar(),

          cursosApi.listar(),

        ]);


        setCertificados(
          Array.isArray(
            respuestaCertificados.data
          )
            ? respuestaCertificados.data
            : []
        );


        setInscripciones(
          Array.isArray(
            respuestaInscripciones.data
          )
            ? respuestaInscripciones.data
            : []
        );


        setParticipantes(
          Array.isArray(
            respuestaParticipantes.data
          )
            ? respuestaParticipantes.data
            : []
        );


        setCursos(
          Array.isArray(
            respuestaCursos.data
          )
            ? respuestaCursos.data
            : []
        );

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudieron cargar los certificados."
          )
        );

      } finally {

        setCargando(false);

      }
    };


  const obtenerInscripcion = (
    inscripcionId
  ) => {

    return inscripciones.find(
      (inscripcion) =>
        Number(inscripcion.id) ===
        Number(inscripcionId)
    );
  };


  const obtenerParticipante = (
    participanteId
  ) => {

    return participantes.find(
      (participante) =>
        Number(participante.id) ===
        Number(participanteId)
    );
  };


  const obtenerCurso = (
    cursoId
  ) => {

    return cursos.find(
      (curso) =>
        Number(curso.id) ===
        Number(cursoId)
    );
  };


  const obtenerDetalleInscripcion = (
    inscripcionId
  ) => {

    const inscripcion =
      obtenerInscripcion(
        inscripcionId
      );


    if (!inscripcion) {

      return {
        participante:
          `Inscripción #${inscripcionId}`,

        curso: "",

        cursoEstado: "",

      };
    }


    const participante =
      obtenerParticipante(
        inscripcion.participante_id
      );


    const curso =
      obtenerCurso(
        inscripcion.curso_id
      );


    return {

      participante:
        participante
          ? `${participante.nombres} ${participante.apellidos}`
          : `Participante #${inscripcion.participante_id}`,

      curso:
        curso
          ? curso.nombre
          : `Curso #${inscripcion.curso_id}`,

      cursoEstado:
        curso
          ? curso.estado
          : "",

    };
  };


  const inscripcionesDisponibles =
    useMemo(() => {

      return inscripciones.filter(
        (inscripcion) => {

          const curso =
            obtenerCurso(
              inscripcion.curso_id
            );


          if (!curso) {
            return false;
          }


          const cursoFinalizado =
            textoSeguro(
              curso.estado
            ).toUpperCase() ===
            "FINALIZADO";


          const yaTieneCertificado =
            certificados.some(
              (certificado) =>
                Number(
                  certificado.inscripcion_id
                ) ===
                Number(
                  inscripcion.id
                )
            );


          return (
            cursoFinalizado &&
            !yaTieneCertificado
          );
        }
      );

    }, [
      inscripciones,
      cursos,
      certificados,
    ]);


  const certificadosFiltrados =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return certificados;
      }


      return certificados.filter(
        (certificado) => {

          const detalle =
            obtenerDetalleInscripcion(
              certificado.inscripcion_id
            );


          const valores = [
            certificado.id,
            certificado.inscripcion_id,
            certificado.codigo_certificado,
            certificado.fecha_emision,
            certificado.estado_certificado,
            detalle.participante,
            detalle.curso,
          ];


          return valores.some(
            (valor) =>
              textoSeguro(
                valor
              )
                .toLowerCase()
                .includes(
                  texto
                )
          );
        }
      );

    }, [
      certificados,
      inscripciones,
      participantes,
      cursos,
      busqueda,
    ]);


  const manejarCambio = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormulario(
      (actual) => ({
        ...actual,
        [name]: value,
      })
    );
  };


  const generarCodigoSugerido = () => {

    const anio =
      new Date().getFullYear();


    const siguienteNumero =
      certificados.length + 1;


    const numero =
      String(
        siguienteNumero
      ).padStart(
        4,
        "0"
      );


    return (
      `CERT-${anio}-${numero}`
    );
  };


  const abrirNuevo = () => {

    setEditandoId(null);


    setFormulario({

      inscripcion_id: "",

      codigo_certificado:
        generarCodigoSugerido(),

      fecha_emision:
        obtenerFechaActual(),

      estado_certificado:
        "GENERADO",

    });


    setMensaje("");
    setError("");

    setMostrarFormulario(true);
  };


  const editarCertificado = (
    certificado
  ) => {

    setEditandoId(
      certificado.id
    );


    setFormulario({

      inscripcion_id:
        textoSeguro(
          certificado.inscripcion_id
        ),

      codigo_certificado:
        textoSeguro(
          certificado.codigo_certificado
        ),

      fecha_emision:
        textoSeguro(
          certificado.fecha_emision
        ),

      estado_certificado:
        textoSeguro(
          certificado.estado_certificado
        ) || "GENERADO",

    });


    setMensaje("");
    setError("");

    setMostrarFormulario(true);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const cerrarFormulario = () => {

    setMostrarFormulario(false);

    setEditandoId(null);

    setFormulario({
      ...formularioInicial,
    });

    setError("");
  };


  const validarFormulario = () => {

    if (
      !formulario.inscripcion_id
    ) {
      return (
        "Debe seleccionar una inscripción."
      );
    }


    if (
      !formulario.codigo_certificado
        .trim()
    ) {
      return (
        "El código del certificado es obligatorio."
      );
    }


    if (
      !formulario.fecha_emision
    ) {
      return (
        "Debe seleccionar la fecha de emisión."
      );
    }


    if (
      formulario.fecha_emision >
      obtenerFechaActual()
    ) {
      return (
        "La fecha de emisión no puede ser posterior a la fecha actual."
      );
    }


    const inscripcion =
      obtenerInscripcion(
        formulario.inscripcion_id
      );


    if (!inscripcion) {
      return (
        "La inscripción seleccionada no existe."
      );
    }


    const curso =
      obtenerCurso(
        inscripcion.curso_id
      );


    if (!curso) {
      return (
        "El curso relacionado no existe."
      );
    }


    if (
      textoSeguro(
        curso.estado
      ).toUpperCase() !==
      "FINALIZADO"
    ) {
      return (
        "El curso aún no ha finalizado."
      );
    }


    if (
      editandoId === null
    ) {

      const duplicado =
        certificados.some(
          (certificado) =>
            Number(
              certificado.inscripcion_id
            ) ===
            Number(
              formulario.inscripcion_id
            )
        );


      if (duplicado) {
        return (
          "La inscripción ya tiene un certificado emitido."
        );
      }
    }


    return "";
  };


  const guardarCertificado =
    async (event) => {

      event.preventDefault();

      setMensaje("");
      setError("");


      const validacion =
        validarFormulario();


      if (validacion) {

        setError(
          validacion
        );

        return;
      }


      const payload = {

        inscripcion_id:
          Number(
            formulario.inscripcion_id
          ),

        codigo_certificado:
          formulario.codigo_certificado
            .trim()
            .toUpperCase(),

        fecha_emision:
          formulario.fecha_emision,

        estado_certificado:
          formulario.estado_certificado,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await certificadosApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Certificado actualizado correctamente."
          );

        } else {

          await certificadosApi.crear(
            payload
          );


          setMensaje(
            "Certificado generado correctamente."
          );
        }


        setMostrarFormulario(false);

        setEditandoId(null);

        setFormulario({
          ...formularioInicial,
        });


        await cargarDatos();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo guardar el certificado."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarCertificado =
    async (
      certificado
    ) => {

      const detalle =
        obtenerDetalleInscripcion(
          certificado.inscripcion_id
        );


      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar el certificado "${certificado.codigo_certificado}" de "${detalle.participante}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await certificadosApi.eliminar(
          certificado.id
        );


        setMensaje(
          "Certificado eliminado correctamente."
        );


        await cargarDatos();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar el certificado."
          )
        );
      }
    };


  const totalGenerados =
    certificados.filter(
      (item) =>
        textoSeguro(
          item.estado_certificado
        ).toUpperCase() ===
        "GENERADO"
    ).length;


  const inscripcionSeleccionada =
    obtenerInscripcion(
      formulario.inscripcion_id
    );


  const cursoSeleccionado =
    inscripcionSeleccionada
      ? obtenerCurso(
          inscripcionSeleccionada.curso_id
        )
      : null;


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="certificate"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              ACREDITACIÓN ACADÉMICA
            </span>

            <h1>
              Certificados
            </h1>

            <p>
              Emisión y control de
              certificados correspondientes
              a cursos finalizados.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="btn-primary module-main-action"
          onClick={
            abrirNuevo
          }
        >

          <AppIcon
            name="plus"
            size={16}
          />

          Nuevo certificado

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Certificados emitidos
          </span>

          <strong>
            {
              certificados.length
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Generados
          </span>

          <strong>
            {
              totalGenerados
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Elegibles
          </span>

          <strong>
            {
              inscripcionesDisponibles.length
            }
          </strong>

        </div>


        <div className="module-summary-card module-summary-accreditation">

          <div className="module-summary-icon">

            <AppIcon
              name="certificate"
              size={19}
            />

          </div>


          <div>

            <span>
              Control académico
            </span>

            <p>
              Una inscripción no puede
              recibir certificados duplicados.
            </p>

          </div>

        </div>

      </div>


      {mensaje && (

        <div className="alert alert-success">
          {mensaje}
        </div>

      )}


      {error && (

        <div className="alert alert-error">
          {error}
        </div>

      )}


      {mostrarFormulario && (

        <section className="form-card module-form-card">

          <div className="form-card-header">

            <div>

              <span className="form-section-label">
                EMISIÓN DE CERTIFICADO
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar certificado"
                  : "Generar certificado"}

              </h2>

              <p>
                La emisión está habilitada
                únicamente para cursos
                finalizados.
              </p>

            </div>


            <button
              type="button"
              className="btn-close"
              onClick={
                cerrarFormulario
              }
            >
              ×
            </button>

          </div>


          <form
            onSubmit={
              guardarCertificado
            }
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Inscripción
                </label>

                <select
                  name="inscripcion_id"
                  value={
                    formulario.inscripcion_id
                  }
                  onChange={
                    manejarCambio
                  }
                  disabled={
                    editandoId !== null
                  }
                  required
                >

                  <option value="">
                    Seleccione una inscripción
                  </option>


                  {editandoId !== null ? (

                    inscripciones
                      .filter(
                        (inscripcion) =>
                          Number(
                            inscripcion.id
                          ) ===
                          Number(
                            formulario.inscripcion_id
                          )
                      )
                      .map(
                        (inscripcion) => {

                          const detalle =
                            obtenerDetalleInscripcion(
                              inscripcion.id
                            );


                          return (

                            <option
                              key={
                                inscripcion.id
                              }
                              value={
                                inscripcion.id
                              }
                            >
                              #{inscripcion.id}
                              {" — "}
                              {detalle.participante}
                              {" — "}
                              {detalle.curso}
                            </option>

                          );
                        }
                      )

                  ) : (

                    inscripcionesDisponibles.map(
                      (inscripcion) => {

                        const detalle =
                          obtenerDetalleInscripcion(
                            inscripcion.id
                          );


                        return (

                          <option
                            key={
                              inscripcion.id
                            }
                            value={
                              inscripcion.id
                            }
                          >
                            #{inscripcion.id}
                            {" — "}
                            {detalle.participante}
                            {" — "}
                            {detalle.curso}
                          </option>

                        );
                      }
                    )

                  )}

                </select>


                {editandoId === null &&
                  inscripcionesDisponibles.length === 0 && (

                    <small className="form-help">
                      No existen inscripciones
                      elegibles sin certificado.
                    </small>

                  )}

              </div>


              <div className="form-group">

                <label>
                  Código del certificado
                </label>

                <input
                  type="text"
                  name="codigo_certificado"
                  value={
                    formulario.codigo_certificado
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Fecha de emisión
                </label>

                <input
                  type="date"
                  name="fecha_emision"
                  max={
                    obtenerFechaActual()
                  }
                  value={
                    formulario.fecha_emision
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Estado
                </label>

                <input
                  type="text"
                  name="estado_certificado"
                  value={
                    formulario.estado_certificado
                  }
                  readOnly
                />

              </div>

            </div>


            {inscripcionSeleccionada && (

              <div className="certificate-info certificate-info-v2">

                <div>

                  <span>
                    Participante
                  </span>

                  <strong>
                    {
                      obtenerDetalleInscripcion(
                        formulario.inscripcion_id
                      ).participante
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Curso
                  </span>

                  <strong>
                    {
                      obtenerDetalleInscripcion(
                        formulario.inscripcion_id
                      ).curso
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Estado del curso
                  </span>

                  <strong>
                    {
                      cursoSeleccionado?.estado ||
                      "-"
                    }
                  </strong>

                </div>

              </div>

            )}


            <div className="form-actions">

              <button
                type="button"
                className="btn-secondary"
                onClick={
                  cerrarFormulario
                }
              >
                Cancelar
              </button>


              <button
                type="submit"
                className="btn-primary"
                disabled={
                  guardando ||
                  (
                    editandoId === null &&
                    inscripcionesDisponibles.length === 0
                  )
                }
              >

                {guardando
                  ? "Guardando..."
                  : editandoId !== null
                    ? "Guardar cambios"
                    : "Generar certificado"}

              </button>

            </div>

          </form>

        </section>

      )}


      <section className="data-card module-data-card">

        <div className="module-table-toolbar">

          <div className="module-search">

            <AppIcon
              name="search"
              size={16}
            />

            <input
              type="text"
              value={
                busqueda
              }
              onChange={(event) =>
                setBusqueda(
                  event.target.value
                )
              }
              placeholder="Buscar participante, curso, código o fecha..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                certificadosFiltrados.length
              }

              {" "}

              certificado

              {
                certificadosFiltrados.length !== 1
                  ? "s"
                  : ""
              }

            </span>


            <button
              type="button"
              className="btn-secondary"
              onClick={
                cargarDatos
              }
              disabled={
                cargando
              }
            >

              <AppIcon
                name="refresh"
                size={15}
              />

              Actualizar

            </button>

          </div>

        </div>


        {cargando ? (

          <div className="empty-state">
            Cargando certificados...
          </div>

        ) : certificadosFiltrados.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="certificate"
              size={28}
            />

            <strong>
              No se encontraron certificados.
            </strong>

            <div className="empty-state-subtitle">
              Los certificados se habilitan
              para cursos finalizados.
            </div>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Participante</th>
                  <th>Curso</th>
                  <th>Código</th>
                  <th>Fecha emisión</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {certificadosFiltrados.map(
                  (certificado) => {

                    const detalle =
                      obtenerDetalleInscripcion(
                        certificado.inscripcion_id
                      );


                    return (

                      <tr
                        key={
                          certificado.id
                        }
                      >

                        <td>
                          #{certificado.id}
                        </td>


                        <td>

                          <div className="certificate-person-cell">

                            <div className="certificate-person-icon">

                              <AppIcon
                                name="users"
                                size={15}
                              />

                            </div>


                            <div>

                              <strong>
                                {
                                  detalle.participante
                                }
                              </strong>

                              <span>
                                Inscripción #
                                {
                                  certificado.inscripcion_id
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="certificate-course-cell">

                            <AppIcon
                              name="book"
                              size={14}
                            />

                            <span>
                              {
                                detalle.curso
                              }
                            </span>

                          </div>

                        </td>


                        <td>

                          <span className="certificate-code">
                            {
                              certificado.codigo_certificado
                            }
                          </span>

                        </td>


                        <td>

                          <span className="date-chip">
                            {
                              certificado.fecha_emision
                            }
                          </span>

                        </td>


                        <td>

                          <span className="badge badge-green">
                            {
                              certificado.estado_certificado
                            }
                          </span>

                        </td>


                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              className="btn-table"
                              onClick={() =>
                                editarCertificado(
                                  certificado
                                )
                              }
                            >
                              Editar
                            </button>


                            <button
                              type="button"
                              className="btn-table danger"
                              onClick={() =>
                                eliminarCertificado(
                                  certificado
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}