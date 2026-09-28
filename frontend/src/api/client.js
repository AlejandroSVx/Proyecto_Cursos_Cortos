const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


async function request(
  path,
  {
    method = "GET",
    body,
  } = {}
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${API_URL}${path}`,
    options
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const errorBody =
      await response.json().catch(() => ({
        detail: `Error ${response.status}`,
      }));

    throw new Error(
      errorBody.detail ||
      `Error ${response.status}`
    );
  }

  return response.json();
}


const cursosApi = {
  listar: () =>
    request("/cursos/"),

  obtener: (id) =>
    request(`/cursos/${id}`),

  crear: (data) =>
    request("/cursos/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/cursos/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/cursos/${id}`, {
      method: "DELETE",
    }),
};


const participantesApi = {
  listar: () =>
    request("/participantes/"),

  obtener: (id) =>
    request(`/participantes/${id}`),

  crear: (data) =>
    request("/participantes/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/participantes/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/participantes/${id}`, {
      method: "DELETE",
    }),
};


const inscripcionesApi = {
  listar: () =>
    request("/inscripciones/"),

  obtener: (id) =>
    request(`/inscripciones/${id}`),

  crear: (data) =>
    request("/inscripciones/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/inscripciones/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/inscripciones/${id}`, {
      method: "DELETE",
    }),
};


const pagosApi = {
  listar: () =>
    request("/pagos/"),

  obtener: (id) =>
    request(`/pagos/${id}`),

  crear: (data) =>
    request("/pagos/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/pagos/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/pagos/${id}`, {
      method: "DELETE",
    }),
};


const instructoresApi = {
  listar: () =>
    request("/instructores/"),

  obtener: (id) =>
    request(`/instructores/${id}`),

  crear: (data) =>
    request("/instructores/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/instructores/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/instructores/${id}`, {
      method: "DELETE",
    }),
};


const aulasApi = {
  listar: () =>
    request("/aulas/"),

  obtener: (id) =>
    request(`/aulas/${id}`),

  crear: (data) =>
    request("/aulas/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/aulas/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/aulas/${id}`, {
      method: "DELETE",
    }),
};


const asignacionesApi = {
  listar: () =>
    request("/asignaciones/"),

  obtener: (id) =>
    request(`/asignaciones/${id}`),

  crear: (data) =>
    request("/asignaciones/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/asignaciones/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/asignaciones/${id}`, {
      method: "DELETE",
    }),
};


const certificadosApi = {
  listar: () =>
    request("/certificados/"),

  obtener: (id) =>
    request(`/certificados/${id}`),

  crear: (data) =>
    request("/certificados/", {
      method: "POST",
      body: data,
    }),

  actualizar: (id, data) =>
    request(`/certificados/${id}`, {
      method: "PUT",
      body: data,
    }),

  eliminar: (id) =>
    request(`/certificados/${id}`, {
      method: "DELETE",
    }),
};


export {
  API_URL,
  request,
  cursosApi,
  participantesApi,
  inscripcionesApi,
  pagosApi,
  instructoresApi,
  aulasApi,
  asignacionesApi,
  certificadosApi,
};