import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const login = async (username, password) => {
    if (!username || !password) {
      return;
    }
    try {
      const putData = {
        username: username,
        password: password,
      };
      const response = await fetch(
        // "https://notes-app-indol-kappa.vercel.app/api/v1/users/login",
        "http://localhost:4000/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(putData),
        }
      );

      const json = await response.json();
      console.log(json);
      localStorage.setItem("token", json.data.token);
    } catch (err) {
      console.log("Error while login the user", err.message);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        // "https://notes-app-indol-kappa.vercel.app/api/v1/users/logout",
        "http://localhost:4000/api/v1/users/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      console.log("logout json:", json);
    } catch (error) {
      console.log("Error while logout the user", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
