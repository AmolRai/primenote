import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/auth.module.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authCookie, setAuthCookie] = useState(document.cookie);

  const getDetails = async () => {
    const obj = {
      fullName: "Amol Rai",
      password: 22,
      username: "amol",
    };
    const response = await fetch(
      "https://notes-app-indol-kappa.vercel.app/api/v1/users/details",
      // "http://localhost:4000/api/v1/users/details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
        credentials: "include",
      }
    );
    const json = await response.json();
    console.log("details json:", json);
  };

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (authCookie) {
      navigate("/");
    }
  }, [authCookie]);

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    await login(username, password);
    setAuthCookie(document.cookie);
    setIsLoading(false);
  };

  return (
    <div className={styles.auth}>
      {isLoading && (
        <div className="overlay">
          <span className="loader"></span>
        </div>
      )}
      <div className="flexCol" style={{ gap: "1rem" }}>
        <img
          style={{ width: "5rem" }}
          src="https://cdn-icons-png.flaticon.com/128/10335/10335740.png"
        />
        <h1>Log in</h1>
      </div>
      <div style={{ gap: "5px", marginTop: "2rem", maxWidth: "320px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button className={styles.authBtn} onClick={handleLogin}>
        Log in
      </button>
      <p style={{ color: "#a7aaad", fontSize: "1rem", marginTop: "1.5rem" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "#2592ff", cursor: "pointer" }}
          onClick={() => {
            navigate("/register");
          }}
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
