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
        "https://notes-app-indol-kappa.vercel.app/api/v1/users/login",
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
      return true;
    } catch (err) {
      console.log("Error while login the user", err.message);
      return false;
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
      return true;
    } catch (error) {
      console.log("Error while logout the user", error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
