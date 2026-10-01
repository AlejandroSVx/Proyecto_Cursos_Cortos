import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  cursosApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  nombre: "",
  tipo_actividad: "Curso Corto",
  fecha_inicio: "",
  fecha_fin: "",
  horario: "",
  costo: "",
  cupo_minimo: "",
  cupo_maximo: "",
  estado: "ACTIVO",
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


export default function CursosPage() {

  const [
    cursos,
    setCursos,
  ] = useState([]);

  const [
    cursosAsignados,
    setCursosAsignados,
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
    tabActiva,
    setTabActiva,
  ] = useState("todos");

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
          (item) => {

            const campo =
              Array.isArray(item?.loc)
                ? item.loc[
                    item.loc.length - 1
                  ]
                : null;


            const mensaje =
              item?.msg ||
              "Error de validación";


            return campo
              ? `${campo}: ${mensaje}`
              : mensaje;
          }
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
          respuestaCursos,
          respuestaAsignados,
        ] = await Promise.all([

          cursosApi.listar(),

          cursosApi.listarConInstructor(),

        ]);


        setCursos(
          Array.isArray(
            respuestaCursos.data
          )
            ? respuestaCursos.data
            : []
        );


        setCursosAsignados(
          Array.isArray(
            respuestaAsignados.data
          )
            ? respuestaAsignados.data
            : []
        );

      } catch (err) {

        console.error(
          "Error cargando cursos:",
          err
        );


        setError(
          obtenerMensajeError(
            err,
            "No se pudieron cargar los cursos."
          )
        );

      } finally {

        setCargando(false);

      }
    };


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


  const editarCurso = (
    curso
  ) => {

    setEditandoId(
      curso.id
    );


    setFormulario({

      nombre:
        textoSeguro(
          curso.nombre
        ),

      tipo_actividad:
        textoSeguro(
          curso.tipo_actividad
        ) || "Curso Corto",

      fecha_inicio:
        textoSeguro(
          curso.fecha_inicio
        ),

      fecha_fin:
        textoSeguro(
          curso.fecha_fin
        ),

      horario:
        textoSeguro(
          curso.horario
        ),

      costo:
        textoSeguro(
          curso.costo
        ),

      cupo_minimo:
        textoSeguro(
          curso.cupo_minimo
        ),

      cupo_maximo:
        textoSeguro(
          curso.cupo_maximo
        ),

      estado:
        textoSeguro(
          curso.estado
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
      formulario.nombre
        .trim()
        .length < 2
    ) {
      return (
        "El nombre del curso es obligatorio."
      );
    }


    if (
      !formulario.tipo_actividad
        .trim()
    ) {
      return (
        "El tipo de actividad es obligatorio."
      );
    }


    if (
      !formulario.fecha_inicio
    ) {
      return (
        "Debe seleccionar la fecha de inicio."
      );
    }


    if (
      !formulario.fecha_fin
    ) {
      return (
        "Debe seleccionar la fecha de finalización."
      );
    }


    if (
      formulario.fecha_fin <=
      formulario.fecha_inicio
    ) {
      return (
        "La fecha de finalización debe ser posterior a la fecha de inicio."
      );
    }


    if (
      !formulario.horario
        .trim()
    ) {
      return (
        "El horario es obligatorio."
      );
    }


    if (
      Number(
        formulario.costo
      ) < 0
    ) {
      return (
        "El costo no puede ser negativo."
      );
    }


    if (
      Number(
        formulario.cupo_minimo
      ) < 0
    ) {
      return (
        "El cupo mínimo no puede ser negativo."
      );
    }


    if (
      Number(
        formulario.cupo_maximo
      ) <= 0
    ) {
      return (
        "El cupo máximo debe ser mayor a cero."
      );
    }


    if (
      Number(
        formulario.cupo_maximo
      ) <
      Number(
        formulario.cupo_minimo
      )
    ) {
      return (
        "El cupo máximo no puede ser menor al cupo mínimo."
      );
    }


    return "";
  };


  const guardarCurso =
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

        nombre:
          formulario.nombre
            .trim(),

        tipo_actividad:
          formulario.tipo_actividad
            .trim(),

        fecha_inicio:
          formulario.fecha_inicio,

        fecha_fin:
          formulario.fecha_fin,

        horario:
          formulario.horario
            .trim(),

        costo:
          Number(
            formulario.costo
          ),

        cupo_minimo:
          Number(
            formulario.cupo_minimo
          ),

        cupo_maximo:
          Number(
            formulario.cupo_maximo
          ),

        estado:
          formulario.estado,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await cursosApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Curso actualizado correctamente."
          );

        } else {

          await cursosApi.crear(
            payload
          );


          setMensaje(
            "Curso registrado correctamente."
          );
        }


        setMostrarFormulario(false);

        setEditandoId(null);

        setFormulario({
          ...formularioInicial,
        });


        await cargarDatos();

      } catch (err) {

        console.error(
          "Error guardando curso:",
          err
        );


        setError(
          obtenerMensajeError(
            err,
            "No se pudo guardar el curso."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarCurso =
    async (curso) => {

      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar el curso "${curso.nombre}"?`
        );


      if (!confirmar) {
        return;
      }


      setMensaje("");
      setError("");


      try {

        await cursosApi.eliminar(
          curso.id
        );


        setMensaje(
          "Curso eliminado correctamente."
        );


        await cargarDatos();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar el curso."
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
      valor === "FINALIZADO"
    ) {
      return "badge badge-blue";
    }


    if (
      valor === "INACTIVO"
    ) {
      return "badge badge-gray";
    }


    if (
      valor === "CANCELADO"
    ) {
      return "badge badge-red";
    }


    return "badge badge-gray";
  };


  const cursosFiltrados =
    useMemo(() => {

      const texto =
        busqueda
          .trim()
          .toLowerCase();


      if (!texto) {
        return cursos;
      }


      return cursos.filter(
        (curso) => {

          const valores = [
            curso.id,
            curso.nombre,
            curso.tipo_actividad,
            curso.fecha_inicio,
            curso.fecha_fin,
            curso.horario,
            curso.costo,
            curso.estado,
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
      cursos,
      busqueda,
    ]);


  const asignadosFiltrados =
    useMemo(() => {

      const texto =
        busqueda
          .trim()
          .toLowerCase();


      if (!texto) {
        return cursosAsignados;
      }


      return cursosAsignados.filter(
        (item) => {

          const valores = [
            item.curso_id,
            item.curso,
            item.horario,
            item.instructor,
            item.aula,
            item.estado_asignacion,
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
      cursosAsignados,
      busqueda,
    ]);


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="book"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              GESTIÓN ACADÉMICA
            </span>

            <h1>
              Cursos
            </h1>

            <p>
              Administración,
              planificación y seguimiento
              de los cursos registrados.
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

          Nuevo curso

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Total cursos
          </span>

          <strong>
            {cursos.length}
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Cursos activos
          </span>

          <strong>

            {
              cursos.filter(
                (curso) =>
                  textoSeguro(
                    curso.estado
                  ).toUpperCase() ===
                  "ACTIVO"
              ).length
            }

          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Finalizados
          </span>

          <strong>

            {
              cursos.filter(
                (curso) =>
                  textoSeguro(
                    curso.estado
                  ).toUpperCase() ===
                  "FINALIZADO"
              ).length
            }

          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Con asignación
          </span>

          <strong>
            {
              cursosAsignados.length
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
                DATOS DEL CURSO
              </span>

              <h2>
                {editandoId !== null
                  ? "Editar curso"
                  : "Registrar nuevo curso"}
              </h2>

              <p>
                Complete la información
                académica y administrativa.
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
              guardarCurso
            }
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Nombre del curso
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={
                    formulario.nombre
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Tipo de actividad
                </label>

                <input
                  type="text"
                  name="tipo_actividad"
                  value={
                    formulario.tipo_actividad
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Curso Corto"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Horario
                </label>

                <input
                  type="text"
                  name="horario"
                  value={
                    formulario.horario
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. 18:30 - 20:30"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Fecha inicio
                </label>

                <input
                  type="date"
                  name="fecha_inicio"
                  value={
                    formulario.fecha_inicio
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Fecha fin
                </label>

                <input
                  type="date"
                  name="fecha_fin"
                  value={
                    formulario.fecha_fin
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Costo
                </label>

                <input
                  type="number"
                  name="costo"
                  min="0"
                  step="0.01"
                  value={
                    formulario.costo
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Cupo mínimo
                </label>

                <input
                  type="number"
                  name="cupo_minimo"
                  min="0"
                  value={
                    formulario.cupo_minimo
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Cupo máximo
                </label>

                <input
                  type="number"
                  name="cupo_maximo"
                  min="1"
                  value={
                    formulario.cupo_maximo
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

                  <option value="ACTIVO">
                    ACTIVO
                  </option>

                  <option value="INACTIVO">
                    INACTIVO
                  </option>

                  <option value="FINALIZADO">
                    FINALIZADO
                  </option>

                  <option value="CANCELADO">
                    CANCELADO
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
                    : "Registrar curso"}

              </button>

            </div>

          </form>

        </section>

      )}


      <section className="data-card module-data-card">

        <div className="module-table-toolbar">

          <div className="module-tabs">

            <button
              type="button"
              className={
                tabActiva === "todos"
                  ? "module-tab active"
                  : "module-tab"
              }
              onClick={() =>
                setTabActiva(
                  "todos"
                )
              }
            >
              Todos los cursos
            </button>


            <button
              type="button"
              className={
                tabActiva === "asignados"
                  ? "module-tab active"
                  : "module-tab"
              }
              onClick={() =>
                setTabActiva(
                  "asignados"
                )
              }
            >
              Cursos asignados
            </button>

          </div>


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
              placeholder="Buscar curso..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">
              {tabActiva === "todos"
                ? `${cursosFiltrados.length} cursos`
                : `${asignadosFiltrados.length} asignados`}
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
            Cargando cursos...
          </div>

        ) : tabActiva === "todos" ? (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Curso</th>
                  <th>Tipo</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Horario</th>
                  <th>Costo</th>
                  <th>Cupos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {cursosFiltrados.map(
                  (curso) => (

                    <tr
                      key={
                        curso.id
                      }
                    >

                      <td>
                        #{curso.id}
                      </td>


                      <td>

                        <div className="record-title-cell">

                          <div className="record-icon">

                            <AppIcon
                              name="book"
                              size={15}
                            />

                          </div>


                          <div>

                            <strong>
                              {curso.nombre}
                            </strong>

                            <span>
                              Registro académico
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        {
                          curso.tipo_actividad
                        }
                      </td>


                      <td>
                        {
                          curso.fecha_inicio
                        }
                      </td>


                      <td>
                        {
                          curso.fecha_fin
                        }
                      </td>


                      <td>

                        <span className="schedule-chip">
                          {
                            curso.horario
                          }
                        </span>

                      </td>


                      <td>

                        <strong className="money-value">
                          Bs. {curso.costo}
                        </strong>

                      </td>


                      <td>

                        <span className="capacity-chip">
                          {curso.cupo_minimo}
                          {" - "}
                          {curso.cupo_maximo}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            claseEstado(
                              curso.estado
                            )
                          }
                        >
                          {curso.estado}
                        </span>

                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="btn-table"
                            onClick={() =>
                              editarCurso(
                                curso
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="btn-table danger"
                            onClick={() =>
                              eliminarCurso(
                                curso
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

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>Curso</th>
                  <th>Horario</th>
                  <th>Instructor</th>
                  <th>Aula</th>
                  <th>Estado</th>
                </tr>

              </thead>


              <tbody>

                {asignadosFiltrados.map(
                  (item) => (

                    <tr
                      key={
                        `${item.curso_id}-${item.instructor_id}-${item.aula_id}`
                      }
                    >

                      <td>

                        <strong>
                          {
                            item.curso
                          }
                        </strong>

                      </td>


                      <td>

                        <span className="schedule-chip">
                          {
                            item.horario
                          }
                        </span>

                      </td>


                      <td>
                        {
                          item.instructor
                        }
                      </td>


                      <td>
                        {
                          item.aula
                        }
                      </td>


                      <td>

                        <span
                          className={
                            item.estado_asignacion ===
                            "ACTIVA"
                              ? "badge badge-green"
                              : item.estado_asignacion ===
                                "MODIFICADA"
                                ? "badge badge-yellow"
                                : item.estado_asignacion ===
                                  "CANCELADA"
                                  ? "badge badge-red"
                                  : "badge badge-gray"
                          }
                        >
                          {
                            item.estado_asignacion
                          }
                        </span>

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