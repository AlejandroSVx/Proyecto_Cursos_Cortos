import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  pagosApi,
  inscripcionesApi,
  participantesApi,
  cursosApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  inscripcion_id: "",
  fecha_pago: "",
  monto: "",
  metodo_pago: "EFECTIVO",
  referencia_pago: "",
  estado_pago: "PENDIENTE",
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


export default function PagosPage() {

  const [
    pagos,
    setPagos,
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
          respuestaPagos,
          respuestaInscripciones,
          respuestaParticipantes,
          respuestaCursos,
        ] = await Promise.all([

          pagosApi.listar(),

          inscripcionesApi.listar(),

          participantesApi.listar(),

          cursosApi.listar(),

        ]);


        setPagos(
          Array.isArray(
            respuestaPagos.data
          )
            ? respuestaPagos.data
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
            "No se pudieron cargar los pagos."
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

        documento: "",

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

      documento:
        participante
          ? participante.numero_documento
          : "",

    };
  };


  const obtenerFechaInscripcionSeleccionada =
    () => {

      if (
        !formulario.inscripcion_id
      ) {
        return "";
      }


      const inscripcion =
        obtenerInscripcion(
          formulario.inscripcion_id
        );


      return (
        inscripcion?.fecha_inscripcion ||
        ""
      );
    };


  const pagosFiltrados =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return pagos;
      }


      return pagos.filter(
        (pago) => {

          const inscripcion =
            inscripciones.find(
              (item) =>
                Number(item.id) ===
                Number(
                  pago.inscripcion_id
                )
            );


          let nombreParticipante = "";
          let nombreCurso = "";


          if (inscripcion) {

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


            if (participante) {

              nombreParticipante =
                `${participante.nombres} ${participante.apellidos}`;

            }


            if (curso) {

              nombreCurso =
                curso.nombre;

            }
          }


          const valores = [
            pago.id,
            pago.fecha_pago,
            pago.monto,
            pago.metodo_pago,
            pago.referencia_pago,
            pago.estado_pago,
            nombreParticipante,
            nombreCurso,
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
      pagos,
      inscripciones,
      participantes,
      cursos,
      busqueda,
    ]);


  const totalConfirmados =
    pagos.filter(
      (pago) =>
        textoSeguro(
          pago.estado_pago
        ).toUpperCase() ===
        "CONFIRMADO"
    ).length;


  const totalPendientes =
    pagos.filter(
      (pago) =>
        textoSeguro(
          pago.estado_pago
        ).toUpperCase() ===
        "PENDIENTE"
    ).length;


  const totalRechazados =
    pagos.filter(
      (pago) =>
        textoSeguro(
          pago.estado_pago
        ).toUpperCase() ===
        "RECHAZADO"
    ).length;


  const manejarCambio = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    if (
      name === "metodo_pago"
    ) {

      setFormulario(
        (actual) => ({
          ...actual,
          metodo_pago: value,
          referencia_pago:
            value === "EFECTIVO"
              ? ""
              : actual.referencia_pago,
        })
      );

      return;
    }


    if (
      name === "inscripcion_id"
    ) {

      const inscripcion =
        obtenerInscripcion(
          value
        );


      const fechaInscripcion =
        inscripcion?.fecha_inscripcion ||
        "";


      let nuevaFechaPago =
        formulario.fecha_pago;


      if (
        nuevaFechaPago &&
        fechaInscripcion &&
        nuevaFechaPago <
          fechaInscripcion
      ) {
        nuevaFechaPago = "";
      }


      if (
        nuevaFechaPago &&
        nuevaFechaPago >
          obtenerFechaActual()
      ) {
        nuevaFechaPago = "";
      }


      setFormulario(
        (actual) => ({
          ...actual,
          inscripcion_id: value,
          fecha_pago:
            nuevaFechaPago,
        })
      );

      return;
    }


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


  const editarPago = (
    pago
  ) => {

    setEditandoId(
      pago.id
    );


    setFormulario({

      inscripcion_id:
        textoSeguro(
          pago.inscripcion_id
        ),

      fecha_pago:
        textoSeguro(
          pago.fecha_pago
        ),

      monto:
        textoSeguro(
          pago.monto
        ),

      metodo_pago:
        textoSeguro(
          pago.metodo_pago
        ) || "EFECTIVO",

      referencia_pago:
        textoSeguro(
          pago.referencia_pago
        ),

      estado_pago:
        textoSeguro(
          pago.estado_pago
        ) || "PENDIENTE",

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
      !formulario.fecha_pago
    ) {
      return (
        "Debe seleccionar la fecha de pago."
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


    if (
      formulario.fecha_pago <
      inscripcion.fecha_inscripcion
    ) {
      return (
        `La fecha de pago no puede ser anterior a la fecha de inscripción (${inscripcion.fecha_inscripcion}).`
      );
    }


    if (
      formulario.fecha_pago >
      obtenerFechaActual()
    ) {
      return (
        "La fecha de pago no puede ser posterior a la fecha actual."
      );
    }


    if (
      !formulario.monto ||
      Number(
        formulario.monto
      ) <= 0
    ) {
      return (
        "El monto debe ser mayor a cero."
      );
    }


    if (
      (
        formulario.metodo_pago ===
          "TRANSFERENCIA" ||
        formulario.metodo_pago ===
          "QR"
      ) &&
      !formulario.referencia_pago
        .trim()
    ) {
      return (
        "La referencia de pago es obligatoria para transferencia o QR."
      );
    }


    return "";
  };


  const guardarPago =
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

        fecha_pago:
          formulario.fecha_pago,

        monto:
          Number(
            formulario.monto
          ),

        metodo_pago:
          formulario.metodo_pago,

        referencia_pago:
          formulario.metodo_pago ===
            "EFECTIVO"
            ? null
            : formulario.referencia_pago
                .trim(),

        estado_pago:
          formulario.estado_pago,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await pagosApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Pago actualizado correctamente."
          );

        } else {

          await pagosApi.crear(
            payload
          );


          setMensaje(
            "Pago registrado correctamente."
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
            "No se pudo guardar el pago."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarPago =
    async (
      pago
    ) => {

      const detalle =
        obtenerDetalleInscripcion(
          pago.inscripcion_id
        );


      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar el pago de "${detalle.participante}" para "${detalle.curso}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await pagosApi.eliminar(
          pago.id
        );


        setMensaje(
          "Pago eliminado correctamente."
        );


        await cargarDatos();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar el pago."
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
      valor === "CONFIRMADO"
    ) {
      return "badge badge-green";
    }


    if (
      valor === "PENDIENTE"
    ) {
      return "badge badge-yellow";
    }


    if (
      valor === "RECHAZADO"
    ) {
      return "badge badge-red";
    }


    return "badge badge-gray";
  };


  const claseMetodo = (
    metodo
  ) => {

    const valor =
      textoSeguro(
        metodo
      ).toUpperCase();


    if (
      valor === "EFECTIVO"
    ) {
      return "payment-method cash";
    }


    if (
      valor === "TRANSFERENCIA"
    ) {
      return "payment-method transfer";
    }


    if (
      valor === "QR"
    ) {
      return "payment-method qr";
    }


    return "payment-method";
  };


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="wallet"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              GESTIÓN FINANCIERA
            </span>

            <h1>
              Pagos
            </h1>

            <p>
              Registro y seguimiento
              financiero de las
              inscripciones.
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

          Nuevo pago

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Pagos registrados
          </span>

          <strong>
            {
              pagos.length
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Confirmados
          </span>

          <strong>
            {
              totalConfirmados
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Pendientes
          </span>

          <strong>
            {
              totalPendientes
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Rechazados
          </span>

          <strong>
            {
              totalRechazados
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
                INFORMACIÓN DEL PAGO
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar pago"
                  : "Registrar pago"}

              </h2>

              <p>
                Registre la operación
                asociada a una inscripción.
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
              guardarPago
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
                  required
                >

                  <option value="">
                    Seleccione una inscripción
                  </option>


                  {inscripciones.map(
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
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Fecha de pago
                </label>

                <input
                  type="date"
                  name="fecha_pago"
                  min={
                    obtenerFechaInscripcionSeleccionada()
                  }
                  max={
                    obtenerFechaActual()
                  }
                  value={
                    formulario.fecha_pago
                  }
                  onChange={
                    manejarCambio
                  }
                  disabled={
                    !formulario.inscripcion_id
                  }
                  required
                />


                <small className="form-help">

                  {!formulario.inscripcion_id
                    ? (
                      "Primero seleccione una inscripción."
                    )
                    : (
                      `Fecha permitida desde ${obtenerFechaInscripcionSeleccionada()} hasta ${obtenerFechaActual()}.`
                    )}

                </small>

              </div>


              <div className="form-group">

                <label>
                  Monto
                </label>

                <input
                  type="number"
                  name="monto"
                  min="0.01"
                  step="0.01"
                  value={
                    formulario.monto
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Método de pago
                </label>

                <select
                  name="metodo_pago"
                  value={
                    formulario.metodo_pago
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="EFECTIVO">
                    EFECTIVO
                  </option>

                  <option value="TRANSFERENCIA">
                    TRANSFERENCIA
                  </option>

                  <option value="QR">
                    QR
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Referencia
                </label>

                <input
                  type="text"
                  name="referencia_pago"
                  value={
                    formulario.referencia_pago
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder={
                    formulario.metodo_pago ===
                      "EFECTIVO"
                      ? "No aplica"
                      : "Ej. TRX-001"
                  }
                  disabled={
                    formulario.metodo_pago ===
                    "EFECTIVO"
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Estado
                </label>

                <select
                  name="estado_pago"
                  value={
                    formulario.estado_pago
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="PENDIENTE">
                    PENDIENTE
                  </option>

                  <option value="CONFIRMADO">
                    CONFIRMADO
                  </option>

                  <option value="RECHAZADO">
                    RECHAZADO
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
                    : "Registrar pago"}

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
              placeholder="Buscar participante, curso, método, referencia o estado..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                pagosFiltrados.length
              }

              {" "}

              pago

              {
                pagosFiltrados.length !== 1
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
            Cargando pagos...
          </div>

        ) : pagosFiltrados.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="wallet"
              size={28}
            />

            <strong>
              No se encontraron pagos.
            </strong>

            <div className="empty-state-subtitle">
              Registra un pago
              o cambia el criterio de búsqueda.
            </div>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Participante / Curso</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Referencia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {pagosFiltrados.map(
                  (pago) => {

                    const detalle =
                      obtenerDetalleInscripcion(
                        pago.inscripcion_id
                      );


                    return (

                      <tr
                        key={
                          pago.id
                        }
                      >

                        <td>
                          #{pago.id}
                        </td>


                        <td>

                          <div className="transaction-person">

                            <div className="transaction-icon">

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
                                {
                                  detalle.curso
                                }
                              </span>

                              <small>
                                Inscripción #
                                {
                                  pago.inscripcion_id
                                }
                              </small>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="date-chip">
                            {
                              pago.fecha_pago
                            }
                          </span>

                        </td>


                        <td>

                          <strong className="money-value payment-amount">
                            Bs. {pago.monto}
                          </strong>

                        </td>


                        <td>

                          <span
                            className={
                              claseMetodo(
                                pago.metodo_pago
                              )
                            }
                          >
                            {
                              pago.metodo_pago
                            }
                          </span>

                        </td>


                        <td>

                          {pago.referencia_pago
                            ? (
                              <span className="document-chip">
                                {
                                  pago.referencia_pago
                                }
                              </span>
                            )
                            : (
                              <span className="table-muted">
                                No aplica
                              </span>
                            )}

                        </td>


                        <td>

                          <span
                            className={
                              claseEstado(
                                pago.estado_pago
                              )
                            }
                          >
                            {
                              pago.estado_pago
                            }
                          </span>

                        </td>


                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              className="btn-table"
                              onClick={() =>
                                editarPago(
                                  pago
                                )
                              }
                            >
                              Editar
                            </button>


                            <button
                              type="button"
                              className="btn-table danger"
                              onClick={() =>
                                eliminarPago(
                                  pago
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