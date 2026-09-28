import { useState } from "react";

import Navbar from "./components/Navbar";

import DashboardPage from "./pages/DashboardPage";
import CursosPage from "./pages/CursosPage";
import ParticipantesPage from "./pages/ParticipantesPage";
import InscripcionesPage from "./pages/InscripcionesPage";
import PagosPage from "./pages/PagosPage";
import InstructoresPage from "./pages/InstructoresPage";
import AulasPage from "./pages/AulasPage";
import AsignacionesPage from "./pages/AsignacionesPage";
import CertificadosPage from "./pages/CertificadosPage";

import "./App.css";


function App() {
  const [pagina, setPagina] =
    useState("dashboard");

  function renderPagina() {
    switch (pagina) {
      case "cursos":
        return <CursosPage />;

      case "participantes":
        return <ParticipantesPage />;

      case "inscripciones":
        return <InscripcionesPage />;

      case "pagos":
        return <PagosPage />;

      case "instructores":
        return <InstructoresPage />;

      case "aulas":
        return <AulasPage />;

      case "asignaciones":
        return <AsignacionesPage />;

      case "certificados":
        return <CertificadosPage />;

      default:
        return (
          <DashboardPage
            setPagina={setPagina}
          />
        );
    }
  }

  return (
    <>
      <Navbar
        pagina={pagina}
        setPagina={setPagina}
      />

      <main className="container">
        {renderPagina()}
      </main>
    </>
  );
}


export default App;