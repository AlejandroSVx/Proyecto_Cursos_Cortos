export default function Navbar({
  pagina,
  setPagina,
}) {
  const opciones = [
    ["dashboard", "Inicio"],
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
    <nav className="navbar">
      <div className="navbar-title">
        Gestión de Cursos
      </div>

      <div className="navbar-links">
        {opciones.map(
          ([valor, texto]) => (
            <button
              key={valor}
              className={
                pagina === valor
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() =>
                setPagina(valor)
              }
            >
              {texto}
            </button>
          )
        )}
      </div>
    </nav>
  );
}