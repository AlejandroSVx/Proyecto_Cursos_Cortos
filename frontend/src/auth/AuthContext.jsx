import {
  createContext,
  useContext,
  useState,
} from "react";

import { authApi } from "../api/client";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "access_token"
      )
    );

  const [usuario, setUsuario] =
    useState(
      localStorage.getItem(
        "usuario"
      ) || ""
    );


  const login = async (
    username,
    password
  ) => {

    const data =
      await authApi.login(
        username,
        password
      );

    const accessToken =
      data.access_token;

    if (!accessToken) {
      throw new Error(
        "El servidor no devolvió un token"
      );
    }

    localStorage.setItem(
      "access_token",
      accessToken
    );

    localStorage.setItem(
      "usuario",
      username
    );

    setToken(
      accessToken
    );

    setUsuario(
      username
    );

    return data;
  };


  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "usuario"
    );

    setToken(null);
    setUsuario("");
  };


  const autenticado =
    Boolean(token);


  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        autenticado,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}