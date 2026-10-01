import {
  useState,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth/AuthContext";


export default function LoginPage() {

  const {
    login,
    autenticado,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    cargando,
    setCargando,
  ] = useState(false);


  if (autenticado) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  const manejarLogin =
    async (event) => {

      event.preventDefault();

      setError("");
      setCargando(true);


      try {

        await login(
          username,
          password
        );


        const destino =
          location.state?.from
            ?.pathname ||
          "/dashboard";


        navigate(
          destino,
          {
            replace: true,
          }
        );

      } catch (err) {

        console.error(err);


        setError(
          err.response?.data?.detail ||
          "Usuario o contraseña incorrectos"
        );

      } finally {

        setCargando(false);

      }
    };


  return (
    <div className="login-page">

      <div className="login-shell">


        <section className="login-visual">

          <div className="login-visual-top">

            <div className="login-main-logo">
              CC
            </div>

            <div>
              <strong>
                Sistema de Gestión
              </strong>

              <span>
                Cursos Cortos
              </span>
            </div>

          </div>


          <div className="login-visual-content">

            <span className="login-eyebrow">
              PLATAFORMA ADMINISTRATIVA
            </span>

            <h1>
              Gestión académica
              centralizada.
            </h1>

            <p>
              Administra cursos,
              participantes, pagos,
              instructores, aulas,
              asignaciones y certificados
              desde una sola plataforma.
            </p>


            <div className="login-features">

              <div>
                <span>01</span>
                <p>
                  Gestión integral de cursos
                </p>
              </div>

              <div>
                <span>02</span>
                <p>
                  Control de inscripciones
                  y pagos
                </p>
              </div>

              <div>
                <span>03</span>
                <p>
                  Planificación académica
                </p>
              </div>

            </div>

          </div>


          <div className="login-visual-footer">
            Sistemas de Información III
          </div>

        </section>


        <section className="login-form-area">

          <form
            className="login-form"
            onSubmit={
              manejarLogin
            }
          >

            <div className="login-heading">

              <span>
                BIENVENIDO
              </span>

              <h2>
                Iniciar sesión
              </h2>

              <p>
                Ingrese sus credenciales
                para acceder al sistema.
              </p>

            </div>


            {error && (

              <div className="alert alert-error">
                {error}
              </div>

            )}


            <div className="form-group">

              <label htmlFor="username">
                Usuario
              </label>

              <input
                id="username"
                type="text"
                value={
                  username
                }
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Ingrese su usuario"
                autoComplete="username"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={
                  password
                }
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                required
              />

            </div>


            <button
              className="btn-login"
              type="submit"
              disabled={
                cargando
              }
            >

              {cargando
                ? "Ingresando..."
                : "Ingresar al sistema"}

            </button>


            <div className="login-security">

              <span className="security-dot" />

              Acceso protegido mediante
              autenticación JWT

            </div>

          </form>

        </section>

      </div>

    </div>
  );
}