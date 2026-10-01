import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "usuario"
      );

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);


export const authApi = {

  login: async (
    username,
    password
  ) => {

    const formData =
      new URLSearchParams();

    formData.append(
      "username",
      username
    );

    formData.append(
      "password",
      password
    );

    const response =
      await axios.post(
        `${API_URL}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

    return response.data;
  },

};


export const cursosApi = {
  listar: () =>
    api.get("/cursos/"),

  obtener: (id) =>
    api.get(`/cursos/${id}`),

  crear: (data) =>
    api.post("/cursos/", data),

  actualizar: (id, data) =>
    api.put(`/cursos/${id}`, data),

  eliminar: (id) =>
    api.delete(`/cursos/${id}`),

  listarConInstructor: () =>
    api.get(
      "/cursos/con-instructor"
    ),
};


export const participantesApi = {
  listar: () =>
    api.get("/participantes/"),

  obtener: (id) =>
    api.get(
      `/participantes/${id}`
    ),

  crear: (data) =>
    api.post(
      "/participantes/",
      data
    ),

  actualizar: (id, data) =>
    api.put(
      `/participantes/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/participantes/${id}`
    ),
};


export const inscripcionesApi = {
  listar: () =>
    api.get("/inscripciones/"),

  obtener: (id) =>
    api.get(
      `/inscripciones/${id}`
    ),

  crear: (data) =>
    api.post(
      "/inscripciones/",
      data
    ),

  actualizar: (id, data) =>
    api.put(
      `/inscripciones/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/inscripciones/${id}`
    ),
};


export const pagosApi = {
  listar: () =>
    api.get("/pagos/"),

  obtener: (id) =>
    api.get(`/pagos/${id}`),

  crear: (data) =>
    api.post("/pagos/", data),

  actualizar: (id, data) =>
    api.put(
      `/pagos/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/pagos/${id}`
    ),
};


export const instructoresApi = {
  listar: () =>
    api.get("/instructores/"),

  obtener: (id) =>
    api.get(
      `/instructores/${id}`
    ),

  crear: (data) =>
    api.post(
      "/instructores/",
      data
    ),

  actualizar: (id, data) =>
    api.put(
      `/instructores/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/instructores/${id}`
    ),
};


export const aulasApi = {
  listar: () =>
    api.get("/aulas/"),

  obtener: (id) =>
    api.get(`/aulas/${id}`),

  crear: (data) =>
    api.post("/aulas/", data),

  actualizar: (id, data) =>
    api.put(
      `/aulas/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/aulas/${id}`
    ),
};


export const asignacionesApi = {
  listar: () =>
    api.get("/asignaciones/"),

  obtener: (id) =>
    api.get(
      `/asignaciones/${id}`
    ),

  crear: (data) =>
    api.post(
      "/asignaciones/",
      data
    ),

  actualizar: (id, data) =>
    api.put(
      `/asignaciones/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/asignaciones/${id}`
    ),
};


export const certificadosApi = {
  listar: () =>
    api.get("/certificados/"),

  obtener: (id) =>
    api.get(
      `/certificados/${id}`
    ),

  crear: (data) =>
    api.post(
      "/certificados/",
      data
    ),

  actualizar: (id, data) =>
    api.put(
      `/certificados/${id}`,
      data
    ),

  eliminar: (id) =>
    api.delete(
      `/certificados/${id}`
    ),
};


export default api;