import { useEffect, useState } from "react";
import { cursosApi } from "../api/client";


const formularioInicial = {
  nombre: "",
  tipo_actividad: "",
  fecha_inicio: "",
  fecha_fin: "",
  horario: "",
  costo: "",
  cupo_minimo: "",
  cupo_maximo: "",
  estado: "ACTIVO",
};


export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [formulario, setFormulario] =
    useState(formularioInicial);

  const [editandoId, setEditandoId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [cargando, setCargando] =
    useState(false);


  async function cargarCursos() {
    try {
      setCargando(true);
      setError("");

      const data = await cursosApi.listar();

      setCursos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarCursos();
  }, []);


  function handleChange(e) {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMensaje("");

    const datos = {
      ...formulario,
      costo: Number(formulario.costo),
      cupo_minimo:
        Number(formulario.cupo_minimo),
      cupo_maximo:
        Number(formulario.cupo_maximo),
    };

    try {
      if (editandoId) {
        await cursosApi.actualizar(
          editandoId,
          datos
        );

        setMensaje(
          "Curso actualizado correctamente."
        );
      } else {
        await cursosApi.crear(datos);

        setMensaje(
          "Curso registrado correctamente."
        );
      }

      setFormulario(formularioInicial);
      setEditandoId(null);

      await cargarCursos();

    } catch (e) {
      setError(e.message);
    }
  }


  function editarCurso(curso) {
    setEditandoId(curso.id);

    setFormulario({
      nombre: curso.nombre,
      tipo_actividad:
        curso.tipo_actividad,
      fecha_inicio:
        curso.fecha_inicio,
      fecha_fin:
        curso.fecha_fin,
      horario:
        curso.horario,
      costo:
        curso.costo,
      cupo_minimo:
        curso.cupo_minimo,
      cupo_maximo:
        curso.cupo_maximo,
      estado:
        curso.estado,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(formularioInicial);
    setError("");
    setMensaje("");
  }


  async function eliminarCurso(id) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este curso?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await cursosApi.eliminar(id);

      setMensaje(
        "Curso eliminado correctamente."
      );

      await cargarCursos();

    } catch (e) {
      setError(e.message);
    }
  }


  return (
    <div>
      <h1>Gestión de Cursos</h1>

      <h2>
        {editandoId
          ? "Actualizar Curso"
          : "Registrar Curso"}
      </h2>

      <form onSubmit={handleSubmit}>
        <label>
          Nombre
        </label>

        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          required
        />

        <label>
          Tipo de actividad
        </label>

        <select
          name="tipo_actividad"
          value={formulario.tipo_actividad}
          onChange={handleChange}
          required
        >
          <option value="">
            Seleccione
          </option>

          <option value="Curso Corto">
            Curso Corto
          </option>

          <option value="Diplomado">
            Diplomado
          </option>
        </select>

        <label>
          Fecha de inicio
        </label>

        <input
          type="date"
          name="fecha_inicio"
          value={formulario.fecha_inicio}
          onChange={handleChange}
          required
        />

        <label>
          Fecha de finalización
        </label>

        <input
          type="date"
          name="fecha_fin"
          value={formulario.fecha_fin}
          onChange={handleChange}
          required
        />

        <label>
          Horario
        </label>

        <input
          type="text"
          name="horario"
          value={formulario.horario}
          onChange={handleChange}
          placeholder="Ej.: 18:30 - 20:30"
          required
        />

        <label>
          Costo
        </label>

        <input
          type="number"
          name="costo"
          value={formulario.costo}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        <label>
          Cupo mínimo
        </label>

        <input
          type="number"
          name="cupo_minimo"
          value={formulario.cupo_minimo}
          onChange={handleChange}
          min="0"
          required
        />

        <label>
          Cupo máximo
        </label>

        <input
          type="number"
          name="cupo_maximo"
          value={formulario.cupo_maximo}
          onChange={handleChange}
          min="1"
          required
        />

        <label>
          Estado
        </label>

        <select
          name="estado"
          value={formulario.estado}
          onChange={handleChange}
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
        </select>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
          >
            {editandoId
              ? "Actualizar"
              : "Registrar"}
          </button>

          {editandoId && (
            <button
              type="button"
              className="secondary-button"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {mensaje && (
        <p className="success">
          {mensaje}
        </p>
      )}

      <h2>Lista de Cursos</h2>

      {cargando && (
        <p>
          Cargando cursos...
        </p>
      )}

      {!cargando &&
        cursos.length === 0 && (
          <p>
            No existen cursos registrados.
          </p>
        )}

      {cursos.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Horario</th>
                <th>Costo</th>
                <th>Cupo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cursos.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.id}</td>

                  <td>
                    {curso.nombre}
                  </td>

                  <td>
                    {curso.tipo_actividad}
                  </td>

                  <td>
                    {curso.fecha_inicio}
                  </td>

                  <td>
                    {curso.fecha_fin}
                  </td>

                  <td>
                    {curso.horario}
                  </td>

                  <td>
                    Bs. {curso.costo}
                  </td>

                  <td>
                    {curso.cupo_minimo}
                    {" / "}
                    {curso.cupo_maximo}
                  </td>

                  <td>
                    {curso.estado}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        editarCurso(curso)
                      }
                    >
                      Editar
                    </button>

                    {" "}

                    <button
                      className="danger-button"
                      onClick={() =>
                        eliminarCurso(
                          curso.id
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}