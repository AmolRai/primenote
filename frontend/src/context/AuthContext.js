import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  document.cookie =
    "username=Duke Martin;expires=Sun, 20 Aug 2030 12:00:00 UTC";
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
        "https://notes-app-indol-kappa.vercel.app/api/v1/users/login",
        // "http://localhost:4000/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Credentials will be included for same-origin and cross-origin
          // requests. This is necessary when making requests to a
          // different domain while using cookies for authentication.
          credentials: "include",
          body: JSON.stringify(putData),
        }
      );

      const json = await response.json();
      console.log("login json:", json);
    } catch (err) {
      console.log("Error while login the user", err.message);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        "https://notes-app-indol-kappa.vercel.app/api/v1/users/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
