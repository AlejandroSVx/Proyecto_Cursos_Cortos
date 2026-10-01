import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  participantesApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  numero_documento: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  correo_electronico: "",
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


export default function ParticipantesPage() {

  const [
    participantes,
    setParticipantes,
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

    cargarParticipantes();

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


  const cargarParticipantes =
    async () => {

      setCargando(true);
      setError("");


      try {

        const response =
          await participantesApi.listar();


        setParticipantes(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudieron cargar los participantes."
          )
        );

      } finally {

        setCargando(false);

      }
    };


  const participantesFiltrados =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return participantes;
      }


      return participantes.filter(
        (participante) => {

          const valores = [
            participante.id,
            participante.numero_documento,
            participante.nombres,
            participante.apellidos,
            participante.telefono,
            participante.correo_electronico,
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
      participantes,
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


  const editarParticipante = (
    participante
  ) => {

    setEditandoId(
      participante.id
    );


    setFormulario({

      numero_documento:
        textoSeguro(
          participante.numero_documento
        ),

      nombres:
        textoSeguro(
          participante.nombres
        ),

      apellidos:
        textoSeguro(
          participante.apellidos
        ),

      telefono:
        textoSeguro(
          participante.telefono
        ),

      correo_electronico:
        textoSeguro(
          participante.correo_electronico
        ),

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
      formulario.numero_documento
        .trim()
        .length < 3
    ) {
      return (
        "El número de documento debe tener al menos 3 caracteres."
      );
    }


    if (
      formulario.nombres
        .trim()
        .length < 2
    ) {
      return (
        "Los nombres deben tener al menos 2 caracteres."
      );
    }


    if (
      formulario.apellidos
        .trim()
        .length < 2
    ) {
      return (
        "Los apellidos deben tener al menos 2 caracteres."
      );
    }


    if (
      formulario.telefono
        .trim()
        .length < 5
    ) {
      return (
        "El teléfono debe tener al menos 5 caracteres."
      );
    }


    const correo =
      formulario.correo_electronico
        .trim();


    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !correoValido.test(
        correo
      )
    ) {
      return (
        "Ingrese un correo electrónico válido."
      );
    }


    return "";
  };


  const guardarParticipante =
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

        numero_documento:
          formulario.numero_documento
            .trim(),

        nombres:
          formulario.nombres
            .trim(),

        apellidos:
          formulario.apellidos
            .trim(),

        telefono:
          formulario.telefono
            .trim(),

        correo_electronico:
          formulario.correo_electronico
            .trim()
            .toLowerCase(),

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await participantesApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Participante actualizado correctamente."
          );

        } else {

          await participantesApi.crear(
            payload
          );


          setMensaje(
            "Participante registrado correctamente."
          );
        }


        setMostrarFormulario(false);

        setEditandoId(null);

        setFormulario({
          ...formularioInicial,
        });


        await cargarParticipantes();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo guardar el participante."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarParticipante =
    async (
      participante
    ) => {

      const nombre =
        `${participante.nombres} ${participante.apellidos}`;


      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar al participante "${nombre}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await participantesApi.eliminar(
          participante.id
        );


        setMensaje(
          "Participante eliminado correctamente."
        );


        await cargarParticipantes();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar el participante."
          )
        );
      }
    };


  const obtenerIniciales = (
    participante
  ) => {

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


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="users"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              GESTIÓN ACADÉMICA
            </span>

            <h1>
              Participantes
            </h1>

            <p>
              Registro y administración
              de participantes del sistema.
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

          Nuevo participante

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Participantes registrados
          </span>

          <strong>
            {
              participantes.length
            }
          </strong>

        </div>


        <div className="module-summary-card module-summary-wide">

          <div className="module-summary-icon">

            <AppIcon
              name="userCheck"
              size={19}
            />

          </div>

          <div>

            <span>
              Base de participantes
            </span>

            <p>
              Información personal y
              datos de contacto centralizados.
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
                INFORMACIÓN PERSONAL
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar participante"
                  : "Registrar participante"}

              </h2>

              <p>
                Complete los datos de
                identificación y contacto.
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
              guardarParticipante
            }
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Número de documento
                </label>

                <input
                  type="text"
                  name="numero_documento"
                  value={
                    formulario.numero_documento
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Nombres
                </label>

                <input
                  type="text"
                  name="nombres"
                  value={
                    formulario.nombres
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Apellidos
                </label>

                <input
                  type="text"
                  name="apellidos"
                  value={
                    formulario.apellidos
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Teléfono
                </label>

                <input
                  type="text"
                  name="telefono"
                  value={
                    formulario.telefono
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="correo_electronico"
                  value={
                    formulario.correo_electronico
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

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
                    : "Registrar participante"}

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
              placeholder="Buscar participante, documento, teléfono o correo..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                participantesFiltrados.length
              }

              {" "}

              participante

              {
                participantesFiltrados.length !== 1
                  ? "s"
                  : ""
              }

            </span>


            <button
              type="button"
              className="btn-secondary"
              onClick={
                cargarParticipantes
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
            Cargando participantes...
          </div>

        ) : participantesFiltrados.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="users"
              size={28}
            />

            <strong>
              No se encontraron participantes.
            </strong>

            <div className="empty-state-subtitle">
              Registra un participante
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
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Correo electrónico</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {participantesFiltrados.map(
                  (participante) => (

                    <tr
                      key={
                        participante.id
                      }
                    >

                      <td>
                        #{participante.id}
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
                              {
                                participante.nombres
                              }
                              {" "}
                              {
                                participante.apellidos
                              }
                            </strong>

                            <div className="table-muted">
                              Participante registrado
                            </div>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="document-chip">
                          {
                            participante.numero_documento
                          }
                        </span>

                      </td>


                      <td>
                        {
                          participante.telefono
                        }
                      </td>


                      <td>

                        <a
                          href={
                            `mailto:${participante.correo_electronico}`
                          }
                          className="email-link"
                        >
                          {
                            participante.correo_electronico
                          }
                        </a>

                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="btn-table"
                            onClick={() =>
                              editarParticipante(
                                participante
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="btn-table danger"
                            onClick={() =>
                              eliminarParticipante(
                                participante
                              )
                            }
                          >
                            Eliminar
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}