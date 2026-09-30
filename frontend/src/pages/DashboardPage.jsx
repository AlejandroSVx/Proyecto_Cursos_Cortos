export default function DashboardPage({
  setPagina,
}) {
  const modulos = [
    ["cursos", "Cursos"],
    ["participantes", "Participantes"],
    ["inscripciones", "Inscripciones"],
    ["pagos", "Pagos"],
    ["instructores", "Instructores"],
    ["aulas", "Aulas"],
    ["asignaciones", "Asignaciones"],
    ["certificados", "Certificados"],
  ];

  return (
    <div>
      <h1>
        Sistema de Gestión de Cursos Cortos
      </h1>

      <p>
        Seleccione un módulo para comenzar.
      </p>

      <div className="dashboard-grid">
        {modulos.map(([valor, texto]) => (
          <button
            key={valor}
            className="dashboard-card"
            onClick={() => setPagina(valor)}
          >
            <h2>{texto}</h2>
            <p>
              Gestionar información de{" "}
              {texto.toLowerCase()}.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}