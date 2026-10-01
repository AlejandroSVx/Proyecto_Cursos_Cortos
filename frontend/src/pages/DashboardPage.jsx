import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  cursosApi,
  participantesApi,
  inscripcionesApi,
  pagosApi,
  instructoresApi,
  aulasApi,
  asignacionesApi,
  certificadosApi,
} from "../api/client";

import AppIcon
  from "../components/AppIcon";


const modulos = [
  {
    key: "cursos",
    titulo: "Cursos",
    descripcion:
      "Administración, planificación y seguimiento de cursos cortos.",
    ruta: "/cursos",
    icono: "book",
  },
  {
    key: "participantes",
    titulo: "Participantes",
    descripcion:
      "Registro y administración de participantes.",
    ruta: "/participantes",
    icono: "users",
  },
  {
    key: "inscripciones",
    titulo: "Inscripciones",
    descripcion:
      "Control de participantes inscritos por curso.",
    ruta: "/inscripciones",
    icono: "clipboard",
  },
  {
    key: "pagos",
    titulo: "Pagos",
    descripcion:
      "Registro y seguimiento financiero.",
    ruta: "/pagos",
    icono: "wallet",
  },
  {
    key: "instructores",
    titulo: "Instructores",
    descripcion:
      "Gestión del personal docente.",
    ruta: "/instructores",
    icono: "teacher",
  },
  {
    key: "aulas",
    titulo: "Aulas",
    descripcion:
      "Administración de infraestructura académica.",
    ruta: "/aulas",
    icono: "building",
  },
  {
    key: "asignaciones",
    titulo: "Asignaciones",
    descripcion:
      "Organización de cursos, instructores y aulas.",
    ruta: "/asignaciones",
    icono: "calendar",
  },
  {
    key: "certificados",
    titulo: "Certificados",
    descripcion:
      "Emisión y control de certificaciones.",
    ruta: "/certificados",
    icono: "certificate",
  },
];


const textoSeguro = (valor) => {

  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  return String(valor);
};


export default function DashboardPage() {

  const [
    datos,
    setDatos,
  ] = useState({
    cursos: [],
    participantes: [],
    inscripciones: [],
    pagos: [],
    instructores: [],
    aulas: [],
    asignaciones: [],
    certificados: [],
  });


  const [
    cargando,
    setCargando,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {

    cargarDatos();

  }, []);


  const cargarDatos =
    async () => {

      setCargando(true);
      setError("");


      try {

        const [
          cursos,
          participantes,
          inscripciones,
          pagos,
          instructores,
          aulas,
          asignaciones,
          certificados,
        ] = await Promise.all([

          cursosApi.listar(),

          participantesApi.listar(),

          inscripcionesApi.listar(),

          pagosApi.listar(),

          instructoresApi.listar(),

          aulasApi.listar(),

          asignacionesApi.listar(),

          certificadosApi.listar(),

        ]);


        setDatos({

          cursos:
            Array.isArray(
              cursos.data
            )
              ? cursos.data
              : [],

          participantes:
            Array.isArray(
              participantes.data
            )
              ? participantes.data
              : [],

          inscripciones:
            Array.isArray(
              inscripciones.data
            )
              ? inscripciones.data
              : [],

          pagos:
            Array.isArray(
              pagos.data
            )
              ? pagos.data
              : [],

          instructores:
            Array.isArray(
              instructores.data
            )
              ? instructores.data
              : [],

          aulas:
            Array.isArray(
              aulas.data
            )
              ? aulas.data
              : [],

          asignaciones:
            Array.isArray(
              asignaciones.data
            )
              ? asignaciones.data
              : [],

          certificados:
            Array.isArray(
              certificados.data
            )
              ? certificados.data
              : [],

        });

      } catch (err) {

        console.error(
          "Error cargando dashboard:",
          err
        );


        setError(
          err.response?.data?.detail ||
          "No se pudieron cargar los datos del panel."
        );

      } finally {

        setCargando(false);

      }
    };


  const totales =
    useMemo(() => {

      return {

        cursos:
          datos.cursos.length,

        participantes:
          datos.participantes.length,

        inscripciones:
          datos.inscripciones.length,

        pagos:
          datos.pagos.length,

        instructores:
          datos.instructores.length,

        aulas:
          datos.aulas.length,

        asignaciones:
          datos.asignaciones.length,

        certificados:
          datos.certificados.length,

      };

    }, [datos]);


  const cursosPorArea =
    useMemo(() => {

      let programacion = 0;
      let ofimatica = 0;
      let otros = 0;


      datos.cursos.forEach(
        (curso) => {

          const nombre =
            textoSeguro(
              curso.nombre
            ).toLowerCase();


          const esProgramacion =
            [
              "python",
              "javascript",
              "js",
              "programación",
              "programacion",
              "código",
              "codigo",
              "desarrollo",
              "web",
            ].some(
              (palabra) =>
                nombre.includes(
                  palabra
                )
            );


          const esOfimatica =
            [
              "excel",
              "word",
              "powerpoint",
              "office",
              "ofimática",
              "ofimatica",
            ].some(
              (palabra) =>
                nombre.includes(
                  palabra
                )
            );


          if (esProgramacion) {

            programacion += 1;

          } else if (esOfimatica) {

            ofimatica += 1;

          } else {

            otros += 1;

          }
        }
      );


      return {
        programacion,
        ofimatica,
        otros,
      };

    }, [datos.cursos]);


  const actividadReciente =
    useMemo(() => {

      const actividades = [];


      datos.inscripciones.forEach(
        (inscripcion) => {

          const participante =
            datos.participantes.find(
              (item) =>
                Number(item.id) ===
                Number(
                  inscripcion.participante_id
                )
            );


          const curso =
            datos.cursos.find(
              (item) =>
                Number(item.id) ===
                Number(
                  inscripcion.curso_id
                )
            );


          actividades.push({

            tipo: "inscripcion",

            icono: "clipboard",

            titulo:
              "Nueva inscripción",

            descripcion:
              participante && curso
                ? `${participante.nombres} ${participante.apellidos} · ${curso.nombre}`
                : `Inscripción #${inscripcion.id}`,

            fecha:
              textoSeguro(
                inscripcion.fecha_inscripcion
              ),

          });
        }
      );


      datos.pagos.forEach(
        (pago) => {

          actividades.push({

            tipo: "pago",

            icono: "wallet",

            titulo:
              "Pago registrado",

            descripcion:
              `Bs. ${textoSeguro(
                pago.monto
              )} · ${textoSeguro(
                pago.metodo_pago
              )}`,

            fecha:
              textoSeguro(
                pago.fecha_pago
              ),

          });
        }
      );


      datos.certificados.forEach(
        (certificado) => {

          actividades.push({

            tipo: "certificado",

            icono: "certificate",

            titulo:
              "Certificado emitido",

            descripcion:
              textoSeguro(
                certificado.codigo_certificado
              ),

            fecha:
              textoSeguro(
                certificado.fecha_emision
              ),

          });
        }
      );


      return actividades
        .sort(
          (a, b) =>
            textoSeguro(
              b.fecha
            ).localeCompare(
              textoSeguro(
                a.fecha
              )
            )
        )
        .slice(
          0,
          5
        );

    }, [datos]);


  const cursosActivos =
    useMemo(() => {

      return datos.cursos.filter(
        (curso) =>
          textoSeguro(
            curso.estado
          ).toUpperCase() ===
          "ACTIVO"
      ).length;

    }, [datos.cursos]);


  const aulasDisponibles =
    useMemo(() => {

      return datos.aulas.filter(
        (aula) =>
          textoSeguro(
            aula.estado_aula
          ).toUpperCase() ===
          "DISPONIBLE"
      ).length;

    }, [datos.aulas]);


  const instructoresActivos =
    useMemo(() => {

      return datos.instructores.filter(
        (instructor) =>
          textoSeguro(
            instructor.estado_instructor
          ).toUpperCase() ===
          "ACTIVO"
      ).length;

    }, [datos.instructores]);


  const inscripcionesConfirmadas =
    useMemo(() => {

      return datos.inscripciones.filter(
        (inscripcion) =>
          textoSeguro(
            inscripcion.estado
          ).toUpperCase() ===
          "CONFIRMADA"
      ).length;

    }, [datos.inscripciones]);


  return (
    <div className="dashboard-page">

      <section className="dashboard-institutional-header">

        <div className="dashboard-header-main">

          <div className="dashboard-header-icon">

            <AppIcon
              name="activity"
              size={22}
            />

          </div>


          <div>

            <span className="page-eyebrow">
              PANEL INSTITUCIONAL
            </span>

            <h1>
              Gestión de Cursos Cortos
            </h1>

            <p>
              Control académico,
              administrativo y financiero
              de la oferta de cursos.
            </p>

          </div>

        </div>


        <div className="dashboard-header-actions">

          <div className="system-status">

            <span className="status-dot" />

            <div>

              <small>
                ESTADO
              </small>

              <strong>
                Sistema operativo
              </strong>

            </div>

          </div>


          <button
            type="button"
            className="btn-secondary dashboard-refresh"
            onClick={
              cargarDatos
            }
            disabled={
              cargando
            }
          >

            <AppIcon
              name="refresh"
              size={16}
            />

            {cargando
              ? "Actualizando..."
              : "Actualizar datos"}

          </button>

        </div>

      </section>


      {error && (

        <div className="alert alert-error">
          {error}
        </div>

      )}


      <section className="dashboard-kpis">

        <div className="dashboard-kpi dashboard-kpi-primary">

          <div className="dashboard-kpi-icon">

            <AppIcon
              name="book"
              size={22}
            />

          </div>


          <div>

            <span>
              Cursos registrados
            </span>

            <strong>
              {cargando
                ? "..."
                : totales.cursos}
            </strong>

            <small>
              {cursosActivos}
              {" "}
              activos actualmente
            </small>

          </div>

        </div>


        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon secondary">

            <AppIcon
              name="users"
              size={20}
            />

          </div>


          <div>

            <span>
              Participantes
            </span>

            <strong>
              {cargando
                ? "..."
                : totales.participantes}
            </strong>

            <small>
              Registrados en el sistema
            </small>

          </div>

        </div>


        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon secondary">

            <AppIcon
              name="clipboard"
              size={20}
            />

          </div>


          <div>

            <span>
              Inscripciones
            </span>

            <strong>
              {cargando
                ? "..."
                : totales.inscripciones}
            </strong>

            <small>
              {inscripcionesConfirmadas}
              {" "}
              confirmadas
            </small>

          </div>

        </div>


        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon secondary">

            <AppIcon
              name="teacher"
              size={20}
            />

          </div>


          <div>

            <span>
              Instructores
            </span>

            <strong>
              {cargando
                ? "..."
                : totales.instructores}
            </strong>

            <small>
              {instructoresActivos}
              {" "}
              activos
            </small>

          </div>

        </div>


        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon secondary">

            <AppIcon
              name="building"
              size={20}
            />

          </div>


          <div>

            <span>
              Aulas
            </span>

            <strong>
              {cargando
                ? "..."
                : totales.aulas}
            </strong>

            <small>
              {aulasDisponibles}
              {" "}
              disponibles
            </small>

          </div>

        </div>

      </section>


      <section className="dashboard-content-grid">

        <div className="dashboard-main-column">

          <div className="dashboard-section-heading">

            <div>

              <span>
                MÓDULOS
              </span>

              <h2>
                Áreas del sistema
              </h2>

              <p>
                Acceso directo a las
                funciones administrativas.
              </p>

            </div>

          </div>


          <div className="module-grid module-grid-v2">

            {modulos.map(
              (modulo) => (

                <Link
                  key={
                    modulo.key
                  }
                  to={
                    modulo.ruta
                  }
                  className="module-card-v2"
                >

                  <div className="module-card-v2-top">

                    <div className="module-card-v2-icon">

                      <AppIcon
                        name={
                          modulo.icono
                        }
                        size={20}
                      />

                    </div>


                    <div className="module-card-v2-count">

                      {cargando
                        ? "..."
                        : totales[
                            modulo.key
                          ]}

                    </div>

                  </div>


                  <h3>
                    {modulo.titulo}
                  </h3>


                  <p>
                    {modulo.descripcion}
                  </p>


                  <div className="module-card-v2-footer">

                    <span>
                      Gestionar
                    </span>

                    <AppIcon
                      name="chevronRight"
                      size={15}
                    />

                  </div>

                </Link>

              )
            )}

          </div>

        </div>


        <aside className="dashboard-side-column">

          <section className="dashboard-panel">

            <div className="dashboard-panel-header">

              <div>

                <span>
                  RESUMEN ACADÉMICO
                </span>

                <h3>
                  Cursos por área
                </h3>

              </div>


              <AppIcon
                name="book"
                size={19}
              />

            </div>


            <div className="area-summary">

              <div className="area-summary-item">

                <div className="area-icon programacion">

                  <AppIcon
                    name="code"
                    size={18}
                  />

                </div>


                <div className="area-info">

                  <div>

                    <strong>
                      Programación
                    </strong>

                    <span>
                      {
                        cursosPorArea.programacion
                      }
                      {" "}
                      cursos
                    </span>

                  </div>


                  <div className="area-progress">

                    <span
                      style={{
                        width:
                          `${
                            totales.cursos > 0
                              ? Math.round(
                                  (
                                    cursosPorArea.programacion /
                                    totales.cursos
                                  ) *
                                  100
                                )
                              : 0
                          }%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              <div className="area-summary-item">

                <div className="area-icon ofimatica">

                  <AppIcon
                    name="monitor"
                    size={18}
                  />

                </div>


                <div className="area-info">

                  <div>

                    <strong>
                      Ofimática
                    </strong>

                    <span>
                      {
                        cursosPorArea.ofimatica
                      }
                      {" "}
                      cursos
                    </span>

                  </div>


                  <div className="area-progress">

                    <span
                      style={{
                        width:
                          `${
                            totales.cursos > 0
                              ? Math.round(
                                  (
                                    cursosPorArea.ofimatica /
                                    totales.cursos
                                  ) *
                                  100
                                )
                              : 0
                          }%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {cursosPorArea.otros > 0 && (

                <div className="area-summary-item">

                  <div className="area-icon otros">

                    <AppIcon
                      name="book"
                      size={18}
                    />

                  </div>


                  <div className="area-info">

                    <div>

                      <strong>
                        Otros
                      </strong>

                      <span>
                        {
                          cursosPorArea.otros
                        }
                        {" "}
                        cursos
                      </span>

                    </div>


                    <div className="area-progress">

                      <span
                        style={{
                          width:
                            `${
                              totales.cursos > 0
                                ? Math.round(
                                    (
                                      cursosPorArea.otros /
                                      totales.cursos
                                    ) *
                                    100
                                  )
                                : 0
                            }%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              )}

            </div>

          </section>


          <section className="dashboard-panel">

            <div className="dashboard-panel-header">

              <div>

                <span>
                  MOVIMIENTO DEL SISTEMA
                </span>

                <h3>
                  Actividad reciente
                </h3>

              </div>


              <AppIcon
                name="activity"
                size={19}
              />

            </div>


            <div className="recent-activity">

              {cargando ? (

                <div className="dashboard-empty">
                  Cargando actividad...
                </div>

              ) : actividadReciente.length === 0 ? (

                <div className="dashboard-empty">
                  No existe actividad reciente.
                </div>

              ) : (

                actividadReciente.map(
                  (
                    actividad,
                    index
                  ) => (

                    <div
                      className="recent-activity-item"
                      key={
                        `${actividad.tipo}-${actividad.fecha}-${index}`
                      }
                    >

                      <div
                        className={
                          `recent-activity-icon ${actividad.tipo}`
                        }
                      >

                        <AppIcon
                          name={
                            actividad.icono
                          }
                          size={16}
                        />

                      </div>


                      <div className="recent-activity-info">

                        <strong>
                          {
                            actividad.titulo
                          }
                        </strong>

                        <p>
                          {
                            actividad.descripcion
                          }
                        </p>

                        <span>
                          {
                            actividad.fecha ||
                            "Sin fecha"
                          }
                        </span>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

        </aside>

      </section>

    </div>
  );
}