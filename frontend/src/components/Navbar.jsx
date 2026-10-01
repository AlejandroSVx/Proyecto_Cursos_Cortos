import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth/AuthContext";

import AppIcon
  from "./AppIcon";


const secciones = [
  {
    titulo: "GENERAL",
    items: [
      {
        ruta: "/dashboard",
        icono: "home",
        titulo: "Inicio",
      },
    ],
  },

  {
    titulo: "GESTIÓN ACADÉMICA",
    items: [
      {
        ruta: "/cursos",
        icono: "book",
        titulo: "Cursos",
      },
      {
        ruta: "/participantes",
        icono: "users",
        titulo: "Participantes",
      },
      {
        ruta: "/inscripciones",
        icono: "clipboard",
        titulo: "Inscripciones",
      },
    ],
  },

  {
    titulo: "GESTIÓN ADMINISTRATIVA",
    items: [
      {
        ruta: "/pagos",
        icono: "wallet",
        titulo: "Pagos",
      },
      {
        ruta: "/instructores",
        icono: "teacher",
        titulo: "Instructores",
      },
      {
        ruta: "/aulas",
        icono: "building",
        titulo: "Aulas",
      },
    ],
  },

  {
    titulo: "PLANIFICACIÓN",
    items: [
      {
        ruta: "/asignaciones",
        icono: "calendar",
        titulo: "Asignaciones",
      },
      {
        ruta: "/certificados",
        icono: "certificate",
        titulo: "Certificados",
      },
    ],
  },
];


export default function Navbar() {

  const {
    usuario,
    logout,
  } = useAuth();


  const navigate =
    useNavigate();


  const cerrarSesion = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  const nombreUsuario =
    typeof usuario === "string"
      ? usuario
      : usuario?.username ||
        usuario?.nombre ||
        "Administrativo";


  const inicial =
    nombreUsuario
      .charAt(0)
      .toUpperCase();


  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="brand-symbol">
          CC
        </div>


        <div className="brand-text">

          <strong>
            Cursos Cortos
          </strong>

          <span>
            Sistema Académico
          </span>

        </div>

      </div>


      <div className="sidebar-institution">

        <div className="sidebar-institution-icon">

          <AppIcon
            name="shield"
            size={16}
          />

        </div>


        <div>

          <span>
            Plataforma administrativa
          </span>

          <strong>
            Gestión académica
          </strong>

        </div>

      </div>


      <nav className="sidebar-nav">

        {secciones.map(
          (seccion) => (

            <div
              className="sidebar-menu-group"
              key={
                seccion.titulo
              }
            >

              <div className="sidebar-section-label">
                {seccion.titulo}
              </div>


              <div className="sidebar-menu-items">

                {seccion.items.map(
                  (enlace) => (

                    <NavLink
                      key={
                        enlace.ruta
                      }
                      to={
                        enlace.ruta
                      }
                      className={({
                        isActive,
                      }) =>
                        isActive
                          ? "sidebar-link active"
                          : "sidebar-link"
                      }
                    >

                      <span className="sidebar-link-icon">

                        <AppIcon
                          name={
                            enlace.icono
                          }
                          size={18}
                        />

                      </span>


                      <span className="sidebar-link-text">
                        {enlace.titulo}
                      </span>


                      <span className="sidebar-link-arrow">

                        <AppIcon
                          name="chevronRight"
                          size={14}
                        />

                      </span>

                    </NavLink>

                  )
                )}

              </div>

            </div>

          )
        )}

      </nav>


      <div className="sidebar-footer">

        <div className="sidebar-user">

          <div className="sidebar-avatar">
            {inicial}
          </div>


          <div className="sidebar-user-info">

            <span>
              Sesión administrativa
            </span>

            <strong>
              {nombreUsuario}
            </strong>

          </div>


          <span
            className="sidebar-online"
            title="Sesión activa"
          />

        </div>


        <button
          type="button"
          className="sidebar-logout"
          onClick={
            cerrarSesion
          }
        >

          <AppIcon
            name="logout"
            size={16}
          />

          <span>
            Cerrar sesión
          </span>

        </button>


        <div className="sidebar-version">
          Sistema de Cursos Cortos · 2026
        </div>

      </div>

    </aside>
  );
}