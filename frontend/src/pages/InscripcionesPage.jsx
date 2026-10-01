import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  inscripcionesApi,
  participantesApi,
  cursosApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  participante_id: "",
  curso_id: "",
  fecha_inscripcion: "",
  estado: "POR PAGAR",
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


export default function InscripcionesPage() {

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
          respuestaInscripciones,
          respuestaParticipantes,
          respuestaCursos,
        ] = await Promise.all([

          inscripcionesApi.listar(),

          participantesApi.listar(),

          cursosApi.listar(),

        ]);


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
            "No se pudieron cargar las inscripciones."
          )
        );

      } finally {

        setCargando(false);

      }
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


  const obtenerIniciales = (
    participante
  ) => {

    if (!participante) {
      return "P";
    }


    const nombres =
      textoSeguro(
        participante.nombres
      ).trim();

    const apellidos =
      textoSeguro(
        participante.apellidos
      ).trim();


    return (
      `${nombres.charAt(0)}${apellidos.charAt(0)}`
        .toUpperCase()
    );
  };


  const inscripcionesFiltradas =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return inscripciones;
      }


      return inscripciones.filter(
        (inscripcion) => {

          const participante =
            participantes.find(
              (item) =>
                Number(item.id) ===
                Number(
                  inscripcion.participante_id
                )
            );


          const curso =
            cursos.find(
              (item) =>
                Number(item.id) ===
                Number(
                  inscripcion.curso_id
                )
            );


          const nombreParticipante =
            participante
              ? `${participante.nombres} ${participante.apellidos}`
              : "";


          const nombreCurso =
            curso
              ? curso.nombre
              : "";


          const valores = [
            inscripcion.id,
            inscripcion.fecha_inscripcion,
            inscripcion.estado,
            nombreParticipante,
            nombreCurso,
            curso?.horario,
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


  const abrirNuevo = () => {

    setEditandoId(null);

    setFormulario({
      ...formularioInicial,
    });

    setMensaje("");
    setError("");

    setMostrarFormulario(true);
  };


  const editarInscripcion = (
    inscripcion
  ) => {

    setEditandoId(
      inscripcion.id
    );


    setFormulario({

      participante_id:
        textoSeguro(
          inscripcion.participante_id
        ),

      curso_id:
        textoSeguro(
          inscripcion.curso_id
        ),

      fecha_inscripcion:
        textoSeguro(
          inscripcion.fecha_inscripcion
        ),

      estado:
        textoSeguro(
          inscripcion.estado
        ) || "POR PAGAR",

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
      !formulario.participante_id
    ) {
      return (
        "Debe seleccionar un participante."
      );
    }


    if (
      !formulario.curso_id
    ) {
      return (
        "Debe seleccionar un curso."
      );
    }


    if (
      !formulario.fecha_inscripcion
    ) {
      return (
        "Debe seleccionar la fecha de inscripción."
      );
    }


    if (
      ![
        "CONFIRMADA",
        "POR PAGAR",
        "CANCELADA",
      ].includes(
        formulario.estado
      )
    ) {
      return (
        "Estado de inscripción no válido."
      );
    }


    return "";
  };


  const guardarInscripcion =
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

        participante_id:
          Number(
            formulario.participante_id
          ),

        curso_id:
          Number(
            formulario.curso_id
          ),

        fecha_inscripcion:
          formulario.fecha_inscripcion,

        estado:
          formulario.estado,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await inscripcionesApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Inscripción actualizada correctamente."
          );

        } else {

          await inscripcionesApi.crear(
            payload
          );


          setMensaje(
            "Inscripción registrada correctamente."
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
            "No se pudo guardar la inscripción."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarInscripcion =
    async (
      inscripcion
    ) => {

      const participante =
        obtenerParticipante(
          inscripcion.participante_id
        );

      const curso =
        obtenerCurso(
          inscripcion.curso_id
        );


      const nombreParticipante =
        participante
          ? `${participante.nombres} ${participante.apellidos}`
          : `Participante #${inscripcion.participante_id}`;


      const nombreCurso =
        curso
          ? curso.nombre
          : `Curso #${inscripcion.curso_id}`;


      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar la inscripción de "${nombreParticipante}" al curso "${nombreCurso}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await inscripcionesApi.eliminar(
          inscripcion.id
        );


        setMensaje(
          "Inscripción eliminada correctamente."
        );


        await cargarDatos();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar la inscripción."
          )
        );
      }
    };


  const claseEstado = (
    estado
  ) => {

    const valor =
      textoSeguro(
        estado
      ).toUpperCase();


    if (
      valor === "CONFIRMADA"
    ) {
      return "badge badge-green";
    }


    if (
      valor === "POR PAGAR"
    ) {
      return "badge badge-yellow";
    }


    if (
      valor === "CANCELADA"
    ) {
      return "badge badge-red";
    }


    return "badge badge-gray";
  };


  const totalConfirmadas =
    inscripciones.filter(
      (item) =>
        textoSeguro(
          item.estado
        ).toUpperCase() ===
        "CONFIRMADA"
    ).length;


  const totalPendientes =
    inscripciones.filter(
      (item) =>
        textoSeguro(
          item.estado
        ).toUpperCase() ===
        "POR PAGAR"
    ).length;


  const totalCanceladas =
    inscripciones.filter(
      (item) =>
        textoSeguro(
          item.estado
        ).toUpperCase() ===
        "CANCELADA"
    ).length;


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="clipboard"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              GESTIÓN ACADÉMICA
            </span>

            <h1>
              Inscripciones
            </h1>

            <p>
              Registro y seguimiento
              de participantes inscritos
              en cursos.
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

          Nueva inscripción

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Total inscripciones
          </span>

          <strong>
            {
              inscripciones.length
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Confirmadas
          </span>

          <strong>
            {
              totalConfirmadas
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Por pagar
          </span>

          <strong>
            {
              totalPendientes
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Canceladas
          </span>

          <strong>
            {
              totalCanceladas
            }
          </strong>

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
                DATOS DE INSCRIPCIÓN
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar inscripción"
                  : "Registrar inscripción"}

              </h2>

              <p>
                Relacione un participante
                con un curso disponible.
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
              guardarInscripcion
            }
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Participante
                </label>

                <select
                  name="participante_id"
                  value={
                    formulario.participante_id
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="">
                    Seleccione un participante
                  </option>


                  {participantes.map(
                    (participante) => (

                      <option
                        key={
                          participante.id
                        }
                        value={
                          participante.id
                        }
                      >
                        {participante.nombres}
                        {" "}
                        {participante.apellidos}
                        {" — "}
                        {participante.numero_documento}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Curso
                </label>

                <select
                  name="curso_id"
                  value={
                    formulario.curso_id
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="">
                    Seleccione un curso
                  </option>


                  {(editandoId !== null
                    ? cursos
                    : cursos.filter(
                        (curso) =>
                          textoSeguro(
                            curso.estado
                          ).toUpperCase() ===
                          "ACTIVO"
                      )
                  ).map(
                    (curso) => (

                      <option
                        key={
                          curso.id
                        }
                        value={
                          curso.id
                        }
                      >
                        {curso.nombre}
                        {" — "}
                        {curso.horario}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Fecha de inscripción
                </label>

                <input
                  type="date"
                  name="fecha_inscripcion"
                  value={
                    formulario.fecha_inscripcion
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

                <select
                  name="estado"
                  value={
                    formulario.estado
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="POR PAGAR">
                    POR PAGAR
                  </option>

                  <option value="CONFIRMADA">
                    CONFIRMADA
                  </option>

                  <option value="CANCELADA">
                    CANCELADA
                  </option>

                </select>

              </div>

            </div>


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
                  guardando
                }
              >

                {guardando
                  ? "Guardando..."
                  : editandoId !== null
                    ? "Guardar cambios"
                    : "Registrar inscripción"}

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
              placeholder="Buscar participante, curso, fecha o estado..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                inscripcionesFiltradas.length
              }

              {" "}

              inscripción

              {
                inscripcionesFiltradas.length !== 1
                  ? "es"
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
            Cargando inscripciones...
          </div>

        ) : inscripcionesFiltradas.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="clipboard"
              size={28}
            />

            <strong>
              No se encontraron inscripciones.
            </strong>

            <div className="empty-state-subtitle">
              Registra una inscripción
              o cambia el criterio de búsqueda.
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
                  <th>Fecha inscripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {inscripcionesFiltradas.map(
                  (inscripcion) => {

                    const participante =
                      obtenerParticipante(
                        inscripcion.participante_id
                      );


                    const curso =
                      obtenerCurso(
                        inscripcion.curso_id
                      );


                    return (

                      <tr
                        key={
                          inscripcion.id
                        }
                      >

                        <td>
                          #{inscripcion.id}
                        </td>


                        <td>

                          <div className="person-cell">

                            <div className="person-avatar">

                              {
                                obtenerIniciales(
                                  participante
                                )
                              }

                            </div>


                            <div>

                              <strong>

                                {participante
                                  ? `${participante.nombres} ${participante.apellidos}`
                                  : `Participante #${inscripcion.participante_id}`}

                              </strong>

                              <div className="table-muted">

                                {participante
                                  ? `Documento: ${participante.numero_documento}`
                                  : ""}

                              </div>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="academic-course-cell">

                            <div className="academic-course-icon">

                              <AppIcon
                                name="book"
                                size={14}
                              />

                            </div>


                            <div>

                              <strong>

                                {curso
                                  ? curso.nombre
                                  : `Curso #${inscripcion.curso_id}`}

                              </strong>

                              <span>

                                {curso?.horario ||
                                  ""}

                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="date-chip">
                            {
                              inscripcion.fecha_inscripcion
                            }
                          </span>

                        </td>


                        <td>

                          <span
                            className={
                              claseEstado(
                                inscripcion.estado
                              )
                            }
                          >
                            {
                              inscripcion.estado
                            }
                          </span>

                        </td>


                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              className="btn-table"
                              onClick={() =>
                                editarInscripcion(
                                  inscripcion
                                )
                              }
                            >
                              Editar
                            </button>


                            <button
                              type="button"
                              className="btn-table danger"
                              onClick={() =>
                                eliminarInscripcion(
                                  inscripcion
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