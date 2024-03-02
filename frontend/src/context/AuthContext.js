import { createContext, useContext, useEffect } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

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
          body: JSON.stringify(putData),
        }
      );

      const json = await response.json();
      console.log(json);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      setCookie("token", json.data.token, {
        path: "/",
        expires: expiryDate,
        secure: true,
        sameSite: "None",
      });
    } catch (err) {
      console.log("Error while login the user", err.message);
    }
  };

  const logout = async () => {
    try {
      const token = cookies.token;
      const response = await fetch(
        "https://notes-app-indol-kappa.vercel.app/api/v1/users/logout",
        // "http://localhost:4000/api/v1/users/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();

      if (json.statusCode === 200) {
        removeCookie("token");
        localStorage.clear();
      }
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
