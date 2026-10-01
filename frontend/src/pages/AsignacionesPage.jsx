import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  asignacionesApi,
  cursosApi,
  instructoresApi,
  aulasApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  curso_id: "",
  instructor_id: "",
  aula_id: "",
  fecha_asignacion: "",
  estado_asignacion: "ACTIVA",
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


export default function AsignacionesPage() {

  const [
    asignaciones,
    setAsignaciones,
  ] = useState([]);

  const [
    cursos,
    setCursos,
  ] = useState([]);

  const [
    instructores,
    setInstructores,
  ] = useState([]);

  const [
    aulas,
    setAulas,
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
          respuestaAsignaciones,
          respuestaCursos,
          respuestaInstructores,
          respuestaAulas,
        ] = await Promise.all([

          asignacionesApi.listar(),

          cursosApi.listar(),

          instructoresApi.listar(),

          aulasApi.listar(),

        ]);


        setAsignaciones(
          Array.isArray(
            respuestaAsignaciones.data
          )
            ? respuestaAsignaciones.data
            : []
        );


        setCursos(
          Array.isArray(
            respuestaCursos.data
          )
            ? respuestaCursos.data
            : []
        );


        setInstructores(
          Array.isArray(
            respuestaInstructores.data
          )
            ? respuestaInstructores.data
            : []
        );


        setAulas(
          Array.isArray(
            respuestaAulas.data
          )
            ? respuestaAulas.data
            : []
        );

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudieron cargar las asignaciones."
          )
        );

      } finally {

        setCargando(false);

      }
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


  const obtenerInstructor = (
    instructorId
  ) => {

    return instructores.find(
      (instructor) =>
        Number(instructor.id) ===
        Number(instructorId)
    );
  };


  const obtenerAula = (
    aulaId
  ) => {

    return aulas.find(
      (aula) =>
        Number(aula.id) ===
        Number(aulaId)
    );
  };


  const obtenerNombreCurso = (
    cursoId
  ) => {

    const curso =
      obtenerCurso(
        cursoId
      );


    return curso
      ? curso.nombre
      : `Curso #${cursoId}`;
  };


  const obtenerNombreInstructor = (
    instructorId
  ) => {

    const instructor =
      obtenerInstructor(
        instructorId
      );


    if (!instructor) {
      return `Instructor #${instructorId}`;
    }


    return (
      `${textoSeguro(
        instructor.nombres
      )} ${textoSeguro(
        instructor.apellidos
      )}`
    ).trim();
  };


  const obtenerNombreAula = (
    aulaId
  ) => {

    const aula =
      obtenerAula(
        aulaId
      );


    return aula
      ? aula.nombre_aula
      : `Aula #${aulaId}`;
  };


  const cursoSeleccionado =
    obtenerCurso(
      formulario.curso_id
    );


  const cursosDisponibles =
    cursos.filter(
      (curso) =>
        textoSeguro(
          curso.estado
        ).toUpperCase() ===
        "ACTIVO"
    );


  const instructoresActivos =
    instructores.filter(
      (instructor) =>
        textoSeguro(
          instructor.estado_instructor
        ).toUpperCase() ===
        "ACTIVO"
    );


  const aulasDisponibles =
    aulas.filter(
      (aula) =>
        textoSeguro(
          aula.estado_aula
        ).toUpperCase() ===
        "DISPONIBLE"
    );


  const asignacionesFiltradas =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return asignaciones;
      }


      return asignaciones.filter(
        (asignacion) => {

          const curso =
            cursos.find(
              (item) =>
                Number(item.id) ===
                Number(
                  asignacion.curso_id
                )
            );


          const instructor =
            instructores.find(
              (item) =>
                Number(item.id) ===
                Number(
                  asignacion.instructor_id
                )
            );


          const aula =
            aulas.find(
              (item) =>
                Number(item.id) ===
                Number(
                  asignacion.aula_id
                )
            );


          const valores = [
            asignacion.id,
            asignacion.fecha_asignacion,
            asignacion.estado_asignacion,
            curso?.nombre,
            curso?.horario,
            instructor
              ? `${instructor.nombres} ${instructor.apellidos}`
              : "",
            aula?.nombre_aula,
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
      asignaciones,
      cursos,
      instructores,
      aulas,
      busqueda,
    ]);


  const manejarCambio = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    if (
      name === "curso_id"
    ) {

      const curso =
        obtenerCurso(
          value
        );


      let fechaActual =
        formulario.fecha_asignacion;


      if (
        curso &&
        fechaActual &&
        fechaActual >=
          curso.fecha_inicio
      ) {
        fechaActual = "";
      }


      setFormulario(
        (actual) => ({
          ...actual,
          curso_id: value,
          fecha_asignacion:
            fechaActual,
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


  const editarAsignacion = (
    asignacion
  ) => {

    setEditandoId(
      asignacion.id
    );


    setFormulario({

      curso_id:
        textoSeguro(
          asignacion.curso_id
        ),

      instructor_id:
        textoSeguro(
          asignacion.instructor_id
        ),

      aula_id:
        textoSeguro(
          asignacion.aula_id
        ),

      fecha_asignacion:
        textoSeguro(
          asignacion.fecha_asignacion
        ),

      estado_asignacion:
        textoSeguro(
          asignacion.estado_asignacion
        ) || "ACTIVA",

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
      !formulario.curso_id
    ) {
      return (
        "Debe seleccionar un curso."
      );
    }


    if (
      !formulario.instructor_id
    ) {
      return (
        "Debe seleccionar un instructor."
      );
    }


    if (
      !formulario.aula_id
    ) {
      return (
        "Debe seleccionar un aula."
      );
    }


    if (
      !formulario.fecha_asignacion
    ) {
      return (
        "Debe seleccionar la fecha de asignación."
      );
    }


    const curso =
      obtenerCurso(
        formulario.curso_id
      );


    if (!curso) {
      return (
        "El curso seleccionado no existe."
      );
    }


    if (
      formulario.fecha_asignacion >=
      curso.fecha_inicio
    ) {
      return (
        `La asignación debe realizarse antes del inicio del curso (${curso.fecha_inicio}).`
      );
    }


    const instructor =
      obtenerInstructor(
        formulario.instructor_id
      );


    if (!instructor) {
      return (
        "El instructor seleccionado no existe."
      );
    }


    if (
      textoSeguro(
        instructor.estado_instructor
      ).toUpperCase() !==
      "ACTIVO"
    ) {
      return (
        "El instructor seleccionado no está activo."
      );
    }


    const aula =
      obtenerAula(
        formulario.aula_id
      );


    if (!aula) {
      return (
        "El aula seleccionada no existe."
      );
    }


    if (
      textoSeguro(
        aula.estado_aula
      ).toUpperCase() !==
      "DISPONIBLE"
    ) {
      return (
        "El aula seleccionada no está disponible."
      );
    }


    if (
      Number(
        aula.capacidad
      ) <
      Number(
        curso.cupo_maximo
      )
    ) {
      return (
        `El aula tiene capacidad para ${aula.capacidad} personas, pero el curso requiere hasta ${curso.cupo_maximo}.`
      );
    }


    if (
      ![
        "ACTIVA",
        "MODIFICADA",
        "CANCELADA",
      ].includes(
        formulario.estado_asignacion
      )
    ) {
      return (
        "Estado de asignación no válido."
      );
    }


    return "";
  };


  const guardarAsignacion =
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

        curso_id:
          Number(
            formulario.curso_id
          ),

        instructor_id:
          Number(
            formulario.instructor_id
          ),

        aula_id:
          Number(
            formulario.aula_id
          ),

        fecha_asignacion:
          formulario.fecha_asignacion,

        estado_asignacion:
          formulario.estado_asignacion,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await asignacionesApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Asignación actualizada correctamente."
          );

        } else {

          await asignacionesApi.crear(
            payload
          );


          setMensaje(
            "Asignación registrada correctamente."
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
            "No se pudo guardar la asignación."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarAsignacion =
    async (
      asignacion
    ) => {

      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar la asignación del curso "${obtenerNombreCurso(asignacion.curso_id)}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await asignacionesApi.eliminar(
          asignacion.id
        );


        setMensaje(
          "Asignación eliminada correctamente."
        );


        await cargarDatos();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar la asignación."
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
      valor === "ACTIVA"
    ) {
      return "badge badge-green";
    }


    if (
      valor === "MODIFICADA"
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


  const obtenerFechaMaximaAsignacion =
    () => {

      if (
        !cursoSeleccionado?.fecha_inicio
      ) {
        return "";
      }


      const fecha =
        new Date(
          `${cursoSeleccionado.fecha_inicio}T00:00:00`
        );


      fecha.setDate(
        fecha.getDate() - 1
      );


      const anio =
        fecha.getFullYear();

      const mes =
        String(
          fecha.getMonth() + 1
        ).padStart(
          2,
          "0"
        );

      const dia =
        String(
          fecha.getDate()
        ).padStart(
          2,
          "0"
        );


      return `${anio}-${mes}-${dia}`;
    };


  const totalActivas =
    asignaciones.filter(
      (item) =>
        textoSeguro(
          item.estado_asignacion
        ).toUpperCase() ===
        "ACTIVA"
    ).length;


  const totalModificadas =
    asignaciones.filter(
      (item) =>
        textoSeguro(
          item.estado_asignacion
        ).toUpperCase() ===
        "MODIFICADA"
    ).length;


  const totalCanceladas =
    asignaciones.filter(
      (item) =>
        textoSeguro(
          item.estado_asignacion
        ).toUpperCase() ===
        "CANCELADA"
    ).length;


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="calendar"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              PLANIFICACIÓN ACADÉMICA
            </span>

            <h1>
              Asignaciones
            </h1>

            <p>
              Organización de cursos,
              instructores, aulas y fechas
              de asignación.
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

          Nueva asignación

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Total asignaciones
          </span>

          <strong>
            {
              asignaciones.length
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Activas
          </span>

          <strong>
            {
              totalActivas
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Modificadas
          </span>

          <strong>
            {
              totalModificadas
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
                PLANIFICACIÓN DEL CURSO
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar asignación"
                  : "Registrar asignación"}

              </h2>

              <p>
                Vincule un curso con
                instructor y aula.
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
              guardarAsignacion
            }
          >

            <div className="form-grid">

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
                    : cursosDisponibles
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
                        {" — "}
                        cupo máx. {curso.cupo_maximo}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Instructor
                </label>

                <select
                  name="instructor_id"
                  value={
                    formulario.instructor_id
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="">
                    Seleccione un instructor
                  </option>


                  {(editandoId !== null
                    ? instructores
                    : instructoresActivos
                  ).map(
                    (instructor) => (

                      <option
                        key={
                          instructor.id
                        }
                        value={
                          instructor.id
                        }
                      >
                        {instructor.nombres}
                        {" "}
                        {instructor.apellidos}
                        {" — "}
                        {instructor.especialidad}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Aula
                </label>

                <select
                  name="aula_id"
                  value={
                    formulario.aula_id
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="">
                    Seleccione un aula
                  </option>


                  {(editandoId !== null
                    ? aulas
                    : aulasDisponibles
                  ).map(
                    (aula) => (

                      <option
                        key={
                          aula.id
                        }
                        value={
                          aula.id
                        }
                      >
                        {aula.nombre_aula}
                        {" — "}
                        capacidad {aula.capacidad}
                        {" — "}
                        {aula.ubicacion}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Fecha de asignación
                </label>

                <input
                  type="date"
                  name="fecha_asignacion"
                  value={
                    formulario.fecha_asignacion
                  }
                  onChange={
                    manejarCambio
                  }
                  max={
                    obtenerFechaMaximaAsignacion()
                  }
                  disabled={
                    !formulario.curso_id
                  }
                  required
                />


                <small className="form-help">

                  {!formulario.curso_id
                    ? (
                      "Primero seleccione un curso."
                    )
                    : (
                      `Debe realizarse como máximo hasta ${obtenerFechaMaximaAsignacion()}.`
                    )}

                </small>

              </div>


              <div className="form-group">

                <label>
                  Estado
                </label>

                <select
                  name="estado_asignacion"
                  value={
                    formulario.estado_asignacion
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="ACTIVA">
                    ACTIVA
                  </option>

                  <option value="MODIFICADA">
                    MODIFICADA
                  </option>

                  <option value="CANCELADA">
                    CANCELADA
                  </option>

                </select>

              </div>

            </div>


            {cursoSeleccionado && (

              <div className="assignment-info assignment-info-v2">

                <div>

                  <span>
                    Curso
                  </span>

                  <strong>
                    {
                      cursoSeleccionado.nombre
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Horario
                  </span>

                  <strong>
                    {
                      cursoSeleccionado.horario
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Inicio
                  </span>

                  <strong>
                    {
                      cursoSeleccionado.fecha_inicio
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Cupo máximo
                  </span>

                  <strong>
                    {
                      cursoSeleccionado.cupo_maximo
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
                  guardando
                }
              >

                {guardando
                  ? "Guardando..."
                  : editandoId !== null
                    ? "Guardar cambios"
                    : "Registrar asignación"}

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
              placeholder="Buscar curso, instructor, aula, horario o estado..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                asignacionesFiltradas.length
              }

              {" "}

              asignación

              {
                asignacionesFiltradas.length !== 1
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
            Cargando asignaciones...
          </div>

        ) : asignacionesFiltradas.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="calendar"
              size={28}
            />

            <strong>
              No se encontraron asignaciones.
            </strong>

            <div className="empty-state-subtitle">
              Registra una asignación
              o cambia el criterio de búsqueda.
            </div>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Curso</th>
                  <th>Instructor</th>
                  <th>Aula</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {asignacionesFiltradas.map(
                  (asignacion) => {

                    const curso =
                      obtenerCurso(
                        asignacion.curso_id
                      );


                    const instructor =
                      obtenerInstructor(
                        asignacion.instructor_id
                      );


                    const aula =
                      obtenerAula(
                        asignacion.aula_id
                      );


                    return (

                      <tr
                        key={
                          asignacion.id
                        }
                      >

                        <td>
                          #{asignacion.id}
                        </td>


                        <td>

                          <div className="assignment-course-cell">

                            <div className="assignment-course-icon">

                              <AppIcon
                                name="book"
                                size={15}
                              />

                            </div>


                            <div>

                              <strong>
                                {
                                  obtenerNombreCurso(
                                    asignacion.curso_id
                                  )
                                }
                              </strong>

                              <span>
                                {
                                  curso?.horario ||
                                  "Sin horario"
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="assignment-resource-cell">

                            <AppIcon
                              name="teacher"
                              size={15}
                            />

                            <div>

                              <strong>
                                {
                                  obtenerNombreInstructor(
                                    asignacion.instructor_id
                                  )
                                }
                              </strong>

                              <span>
                                {
                                  instructor?.especialidad ||
                                  ""
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <div className="assignment-resource-cell">

                            <AppIcon
                              name="building"
                              size={15}
                            />

                            <div>

                              <strong>
                                {
                                  obtenerNombreAula(
                                    asignacion.aula_id
                                  )
                                }
                              </strong>

                              <span>
                                Capacidad:
                                {" "}
                                {
                                  aula?.capacidad ??
                                  "-"
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="date-chip">
                            {
                              asignacion.fecha_asignacion
                            }
                          </span>

                        </td>


                        <td>

                          <span
                            className={
                              claseEstado(
                                asignacion.estado_asignacion
                              )
                            }
                          >
                            {
                              asignacion.estado_asignacion
                            }
                          </span>

                        </td>


                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              className="btn-table"
                              onClick={() =>
                                editarAsignacion(
                                  asignacion
                                )
                              }
                            >
                              Editar
                            </button>


                            <button
                              type="button"
                              className="btn-table danger"
                              onClick={() =>
                                eliminarAsignacion(
                                  asignacion
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