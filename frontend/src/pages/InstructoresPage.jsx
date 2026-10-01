import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  instructoresApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  numero_documento: "",
  nombres: "",
  apellidos: "",
  especialidad: "",
  telefono: "",
  correo_electronico: "",
  estado_instructor: "ACTIVO",
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


export default function InstructoresPage() {

  const [
    instructores,
    setInstructores,
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

    cargarInstructores();

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


  const cargarInstructores =
    async () => {

      setCargando(true);
      setError("");


      try {

        const response =
          await instructoresApi.listar();


        setInstructores(
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
            "No se pudieron cargar los instructores."
          )
        );

      } finally {

        setCargando(false);

      }
    };


  const instructoresFiltrados =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return instructores;
      }


      return instructores.filter(
        (instructor) => {

          const nombreCompleto =
            `${textoSeguro(
              instructor.nombres
            )} ${textoSeguro(
              instructor.apellidos
            )}`;


          const valores = [
            instructor.id,
            instructor.numero_documento,
            instructor.nombres,
            instructor.apellidos,
            nombreCompleto,
            instructor.especialidad,
            instructor.telefono,
            instructor.correo_electronico,
            instructor.estado_instructor,
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
      instructores,
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


  const editarInstructor = (
    instructor
  ) => {

    setEditandoId(
      instructor.id
    );


    setFormulario({

      numero_documento:
        textoSeguro(
          instructor.numero_documento
        ),

      nombres:
        textoSeguro(
          instructor.nombres
        ),

      apellidos:
        textoSeguro(
          instructor.apellidos
        ),

      especialidad:
        textoSeguro(
          instructor.especialidad
        ),

      telefono:
        textoSeguro(
          instructor.telefono
        ),

      correo_electronico:
        textoSeguro(
          instructor.correo_electronico
        ),

      estado_instructor:
        textoSeguro(
          instructor.estado_instructor
        ) || "ACTIVO",

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
      formulario.especialidad
        .trim()
        .length < 2
    ) {
      return (
        "La especialidad es obligatoria."
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


    if (
      ![
        "ACTIVO",
        "INACTIVO",
      ].includes(
        formulario.estado_instructor
      )
    ) {
      return (
        "Estado de instructor no válido."
      );
    }


    return "";
  };


  const guardarInstructor =
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

        especialidad:
          formulario.especialidad
            .trim(),

        telefono:
          formulario.telefono
            .trim(),

        correo_electronico:
          formulario.correo_electronico
            .trim()
            .toLowerCase(),

        estado_instructor:
          formulario.estado_instructor,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await instructoresApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Instructor actualizado correctamente."
          );

        } else {

          await instructoresApi.crear(
            payload
          );


          setMensaje(
            "Instructor registrado correctamente."
          );
        }


        setMostrarFormulario(false);

        setEditandoId(null);

        setFormulario({
          ...formularioInicial,
        });


        await cargarInstructores();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo guardar el instructor."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarInstructor =
    async (
      instructor
    ) => {

      const nombre =
        `${textoSeguro(
          instructor.nombres
        )} ${textoSeguro(
          instructor.apellidos
        )}`.trim();


      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar al instructor "${nombre}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await instructoresApi.eliminar(
          instructor.id
        );


        setMensaje(
          "Instructor eliminado correctamente."
        );


        await cargarInstructores();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar el instructor."
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
      valor === "ACTIVO"
    ) {
      return "badge badge-green";
    }


    if (
      valor === "INACTIVO"
    ) {
      return "badge badge-gray";
    }


    return "badge badge-gray";
  };


  const obtenerIniciales = (
    instructor
  ) => {

    const nombres =
      textoSeguro(
        instructor?.nombres
      ).trim();


    const apellidos =
      textoSeguro(
        instructor?.apellidos
      ).trim();


    return (
      `${nombres.charAt(0)}${apellidos.charAt(0)}`
        .toUpperCase() ||
      "I"
    );
  };


  const totalActivos =
    instructores.filter(
      (instructor) =>
        textoSeguro(
          instructor.estado_instructor
        ).toUpperCase() ===
        "ACTIVO"
    ).length;


  const totalInactivos =
    instructores.filter(
      (instructor) =>
        textoSeguro(
          instructor.estado_instructor
        ).toUpperCase() ===
        "INACTIVO"
    ).length;


  const especialidades =
    new Set(
      instructores
        .map(
          (instructor) =>
            textoSeguro(
              instructor.especialidad
            )
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    ).size;


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="teacher"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              GESTIÓN ACADÉMICA
            </span>

            <h1>
              Instructores
            </h1>

            <p>
              Registro y administración
              del personal docente
              encargado de los cursos.
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

          Nuevo instructor

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Total instructores
          </span>

          <strong>
            {
              instructores.length
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Activos
          </span>

          <strong>
            {
              totalActivos
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Inactivos
          </span>

          <strong>
            {
              totalInactivos
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Especialidades
          </span>

          <strong>
            {
              especialidades
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
                PERFIL DEL INSTRUCTOR
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar instructor"
                  : "Registrar instructor"}

              </h2>

              <p>
                Complete los datos
                personales y profesionales.
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
              guardarInstructor
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
                  Especialidad
                </label>

                <input
                  type="text"
                  name="especialidad"
                  value={
                    formulario.especialidad
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Programación y Bases de Datos"
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


              <div className="form-group">

                <label>
                  Estado
                </label>

                <select
                  name="estado_instructor"
                  value={
                    formulario.estado_instructor
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="ACTIVO">
                    ACTIVO
                  </option>

                  <option value="INACTIVO">
                    INACTIVO
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
                    : "Registrar instructor"}

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
              placeholder="Buscar instructor, documento, especialidad, correo o estado..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                instructoresFiltrados.length
              }

              {" "}

              instructor

              {
                instructoresFiltrados.length !== 1
                  ? "es"
                  : ""
              }

            </span>


            <button
              type="button"
              className="btn-secondary"
              onClick={
                cargarInstructores
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
            Cargando instructores...
          </div>

        ) : instructoresFiltrados.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="teacher"
              size={28}
            />

            <strong>
              No se encontraron instructores.
            </strong>

            <div className="empty-state-subtitle">
              Registra un instructor
              o cambia el criterio de búsqueda.
            </div>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Instructor</th>
                  <th>Documento</th>
                  <th>Especialidad</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {instructoresFiltrados.map(
                  (instructor) => (

                    <tr
                      key={
                        instructor.id
                      }
                    >

                      <td>
                        #{instructor.id}
                      </td>


                      <td>

                        <div className="person-cell">

                          <div className="person-avatar teacher-avatar">

                            {
                              obtenerIniciales(
                                instructor
                              )
                            }

                          </div>


                          <div>

                            <strong>
                              {
                                instructor.nombres
                              }
                              {" "}
                              {
                                instructor.apellidos
                              }
                            </strong>

                            <div className="table-muted">
                              Personal docente
                            </div>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="document-chip">
                          {
                            instructor.numero_documento
                          }
                        </span>

                      </td>


                      <td>

                        <span className="specialty-chip">
                          {
                            instructor.especialidad
                          }
                        </span>

                      </td>


                      <td>

                        <div className="contact-cell">

                          <strong>
                            {
                              instructor.telefono
                            }
                          </strong>

                          <a
                            href={
                              `mailto:${instructor.correo_electronico}`
                            }
                            className="email-link"
                          >
                            {
                              instructor.correo_electronico
                            }
                          </a>

                        </div>

                      </td>


                      <td>

                        <span
                          className={
                            claseEstado(
                              instructor.estado_instructor
                            )
                          }
                        >
                          {
                            instructor.estado_instructor
                          }
                        </span>

                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="btn-table"
                            onClick={() =>
                              editarInstructor(
                                instructor
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="btn-table danger"
                            onClick={() =>
                              eliminarInstructor(
                                instructor
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