import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  aulasApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const formularioInicial = {
  nombre_aula: "",
  capacidad: "",
  ubicacion: "",
  estado_aula: "DISPONIBLE",
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


export default function AulasPage() {

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

    cargarAulas();

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


  const cargarAulas =
    async () => {

      setCargando(true);
      setError("");


      try {

        const response =
          await aulasApi.listar();


        setAulas(
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
            "No se pudieron cargar las aulas."
          )
        );

      } finally {

        setCargando(false);

      }
    };


  const aulasFiltradas =
    useMemo(() => {

      const texto =
        textoSeguro(
          busqueda
        )
          .trim()
          .toLowerCase();


      if (!texto) {
        return aulas;
      }


      return aulas.filter(
        (aula) => {

          const valores = [
            aula.id,
            aula.nombre_aula,
            aula.capacidad,
            aula.ubicacion,
            aula.estado_aula,
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


  const editarAula = (
    aula
  ) => {

    setEditandoId(
      aula.id
    );


    setFormulario({

      nombre_aula:
        textoSeguro(
          aula.nombre_aula
        ),

      capacidad:
        textoSeguro(
          aula.capacidad
        ),

      ubicacion:
        textoSeguro(
          aula.ubicacion
        ),

      estado_aula:
        textoSeguro(
          aula.estado_aula
        ) || "DISPONIBLE",

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
      formulario.nombre_aula
        .trim()
        .length < 2
    ) {
      return (
        "El nombre del aula debe tener al menos 2 caracteres."
      );
    }


    if (
      !formulario.capacidad ||
      Number(
        formulario.capacidad
      ) <= 0
    ) {
      return (
        "La capacidad debe ser mayor a cero."
      );
    }


    if (
      formulario.ubicacion
        .trim()
        .length < 2
    ) {
      return (
        "La ubicación es obligatoria."
      );
    }


    if (
      ![
        "DISPONIBLE",
        "OCUPADA",
        "INACTIVA",
      ].includes(
        formulario.estado_aula
      )
    ) {
      return (
        "Estado de aula no válido."
      );
    }


    return "";
  };


  const guardarAula =
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

        nombre_aula:
          formulario.nombre_aula
            .trim(),

        capacidad:
          Number(
            formulario.capacidad
          ),

        ubicacion:
          formulario.ubicacion
            .trim(),

        estado_aula:
          formulario.estado_aula,

      };


      setGuardando(true);


      try {

        if (
          editandoId !== null
        ) {

          await aulasApi.actualizar(
            editandoId,
            payload
          );


          setMensaje(
            "Aula actualizada correctamente."
          );

        } else {

          await aulasApi.crear(
            payload
          );


          setMensaje(
            "Aula registrada correctamente."
          );
        }


        setMostrarFormulario(false);

        setEditandoId(null);

        setFormulario({
          ...formularioInicial,
        });


        await cargarAulas();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo guardar el aula."
          )
        );

      } finally {

        setGuardando(false);

      }
    };


  const eliminarAula =
    async (
      aula
    ) => {

      const confirmar =
        window.confirm(
          `¿Seguro que deseas eliminar el aula "${aula.nombre_aula}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        await aulasApi.eliminar(
          aula.id
        );


        setMensaje(
          "Aula eliminada correctamente."
        );


        await cargarAulas();

      } catch (err) {

        setError(
          obtenerMensajeError(
            err,
            "No se pudo eliminar el aula."
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
      valor === "DISPONIBLE"
    ) {
      return "badge badge-green";
    }


    if (
      valor === "OCUPADA"
    ) {
      return "badge badge-yellow";
    }


    if (
      valor === "INACTIVA"
    ) {
      return "badge badge-red";
    }


    return "badge badge-gray";
  };


  const disponibles =
    aulas.filter(
      (aula) =>
        textoSeguro(
          aula.estado_aula
        ).toUpperCase() ===
        "DISPONIBLE"
    ).length;


  const ocupadas =
    aulas.filter(
      (aula) =>
        textoSeguro(
          aula.estado_aula
        ).toUpperCase() ===
        "OCUPADA"
    ).length;


  const inactivas =
    aulas.filter(
      (aula) =>
        textoSeguro(
          aula.estado_aula
        ).toUpperCase() ===
        "INACTIVA"
    ).length;


  const capacidadTotal =
    aulas.reduce(
      (
        acumulado,
        aula
      ) =>
        acumulado +
        Number(
          aula.capacidad ||
          0
        ),
      0
    );


  return (
    <div className="module-page">

      <section className="module-page-header">

        <div className="module-page-heading">

          <div className="module-page-icon">

            <AppIcon
              name="building"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              INFRAESTRUCTURA ACADÉMICA
            </span>

            <h1>
              Aulas
            </h1>

            <p>
              Administración de espacios
              destinados al desarrollo
              de los cursos.
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

          Nueva aula

        </button>

      </section>


      <div className="module-summary-row">

        <div className="module-summary-card">

          <span>
            Total aulas
          </span>

          <strong>
            {
              aulas.length
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Disponibles
          </span>

          <strong>
            {
              disponibles
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Ocupadas
          </span>

          <strong>
            {
              ocupadas
            }
          </strong>

        </div>


        <div className="module-summary-card">

          <span>
            Capacidad total
          </span>

          <strong>
            {
              capacidadTotal
            }
          </strong>

        </div>

      </div>


      {inactivas > 0 && (

        <div className="infrastructure-note">

          <AppIcon
            name="building"
            size={16}
          />

          <span>

            Actualmente existen

            {" "}

            <strong>
              {inactivas}
            </strong>

            {" "}

            aula

            {
              inactivas !== 1
                ? "s"
                : ""
            }

            {" "}

            inactiva

            {
              inactivas !== 1
                ? "s"
                : ""
            }

            .

          </span>

        </div>

      )}


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
                DATOS DEL ESPACIO
              </span>

              <h2>

                {editandoId !== null
                  ? "Editar aula"
                  : "Registrar aula"}

              </h2>

              <p>
                Complete la información
                del espacio académico.
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
              guardarAula
            }
          >

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Nombre del aula
                </label>

                <input
                  type="text"
                  name="nombre_aula"
                  value={
                    formulario.nombre_aula
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Laboratorio 3"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Capacidad
                </label>

                <input
                  type="number"
                  name="capacidad"
                  min="1"
                  value={
                    formulario.capacidad
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Ubicación
                </label>

                <input
                  type="text"
                  name="ubicacion"
                  value={
                    formulario.ubicacion
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Bloque B - Piso 1"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Estado
                </label>

                <select
                  name="estado_aula"
                  value={
                    formulario.estado_aula
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="DISPONIBLE">
                    DISPONIBLE
                  </option>

                  <option value="OCUPADA">
                    OCUPADA
                  </option>

                  <option value="INACTIVA">
                    INACTIVA
                  </option>

                </select>


                <small className="form-help">
                  Solo las aulas DISPONIBLES
                  pueden utilizarse en nuevas
                  asignaciones.
                </small>

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
                    : "Registrar aula"}

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
              placeholder="Buscar aula, ubicación, capacidad o estado..."
            />

          </div>


          <div className="module-table-actions">

            <span className="table-counter">

              {
                aulasFiltradas.length
              }

              {" "}

              aula

              {
                aulasFiltradas.length !== 1
                  ? "s"
                  : ""
              }

            </span>


            <button
              type="button"
              className="btn-secondary"
              onClick={
                cargarAulas
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
            Cargando aulas...
          </div>

        ) : aulasFiltradas.length === 0 ? (

          <div className="empty-state">

            <AppIcon
              name="building"
              size={28}
            />

            <strong>
              No se encontraron aulas.
            </strong>

            <div className="empty-state-subtitle">
              Registra un aula
              o cambia el criterio de búsqueda.
            </div>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Aula</th>
                  <th>Ubicación</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {aulasFiltradas.map(
                  (aula) => (

                    <tr
                      key={
                        aula.id
                      }
                    >

                      <td>
                        #{aula.id}
                      </td>


                      <td>

                        <div className="room-cell">

                          <div className="room-icon">

                            <AppIcon
                              name="building"
                              size={16}
                            />

                          </div>


                          <div>

                            <strong>
                              {
                                aula.nombre_aula
                              }
                            </strong>

                            <div className="table-muted">
                              Espacio académico
                            </div>

                          </div>

                        </div>

                      </td>


                      <td>

                        <div className="location-cell">

                          <AppIcon
                            name="building"
                            size={13}
                          />

                          <span>
                            {
                              aula.ubicacion
                            }
                          </span>

                        </div>

                      </td>


                      <td>

                        <span className="capacity-chip room-capacity">

                          {
                            aula.capacidad
                          }

                          {" "}

                          personas

                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            claseEstado(
                              aula.estado_aula
                            )
                          }
                        >
                          {
                            aula.estado_aula
                          }
                        </span>

                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="btn-table"
                            onClick={() =>
                              editarAula(
                                aula
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="btn-table danger"
                            onClick={() =>
                              eliminarAula(
                                aula
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