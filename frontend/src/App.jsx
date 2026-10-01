import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  useAuth,
} from "./auth/AuthContext";

import ProtectedRoute
  from "./auth/ProtectedRoute";

import Navbar
  from "./components/Navbar";

import LoginPage
  from "./pages/LoginPage";

import DashboardPage
  from "./pages/DashboardPage";

import CursosPage
  from "./pages/CursosPage";

import ParticipantesPage
  from "./pages/ParticipantesPage";

import InscripcionesPage
  from "./pages/InscripcionesPage";

import PagosPage
  from "./pages/PagosPage";

import InstructoresPage
  from "./pages/InstructoresPage";

import AulasPage
  from "./pages/AulasPage";

import AsignacionesPage
  from "./pages/AsignacionesPage";

import CertificadosPage
  from "./pages/CertificadosPage";


function Layout({
  children,
}) {

  return (
    <ProtectedRoute>

      <div className="app-layout">

        <Navbar />

        <main className="app-content">
          {children}
        </main>

      </div>

    </ProtectedRoute>
  );
}


export default function App() {

  const {
    autenticado,
  } = useAuth();


  return (
    <Routes>

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />


      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />


      <Route
        path="/cursos"
        element={
          <Layout>
            <CursosPage />
          </Layout>
        }
      />


      <Route
        path="/participantes"
        element={
          <Layout>
            <ParticipantesPage />
          </Layout>
        }
      />


      <Route
        path="/inscripciones"
        element={
          <Layout>
            <InscripcionesPage />
          </Layout>
        }
      />


      <Route
        path="/pagos"
        element={
          <Layout>
            <PagosPage />
          </Layout>
        }
      />


      <Route
        path="/instructores"
        element={
          <Layout>
            <InstructoresPage />
          </Layout>
        }
      />


      <Route
        path="/aulas"
        element={
          <Layout>
            <AulasPage />
          </Layout>
        }
      />


      <Route
        path="/asignaciones"
        element={
          <Layout>
            <AsignacionesPage />
          </Layout>
        }
      />


      <Route
        path="/certificados"
        element={
          <Layout>
            <CertificadosPage />
          </Layout>
        }
      />


      <Route
        path="/"
        element={
          <Navigate
            to={
              autenticado
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />


      <Route
        path="*"
        element={
          <Navigate
            to={
              autenticado
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

    </Routes>
  );
}