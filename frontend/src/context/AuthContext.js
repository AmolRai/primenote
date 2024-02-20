import { createContext, useContext } from "react";

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

      // setCookie("token", json.data.accessToken, 1);
    } catch (err) {
      console.log("Error while login the user", err.message);
    }
  };

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    // Set SameSite attribute to None for cross-site requests
    document.cookie =
      cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=None;Secure";
  }

  const logout = async () => {
    try {
      const response = await fetch(
        "https://notes-app-indol-kappa.vercel.app/api/v1/users/logout",
        // "http://localhost:4000/api/v1/users/logout",
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
