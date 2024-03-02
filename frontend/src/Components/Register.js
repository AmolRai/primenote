import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/auth.module.css";
import useCustomCookie from "../utils/useCustomCookie";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    form.append("fullName", fullName);
    form.append("avatar", avatar);

    if (!username || !password || !fullName || !avatar) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://notes-app-indol-kappa.vercel.app/api/v1/users/register",
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );
      const json = await response.json();
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.log("Error while registering the user", error.message);
      setIsLoading(false);
    }
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
          src={"https://cdn-icons-png.flaticon.com/128/10335/10335740.png"}
        />
        <h1>Sign up</h1>
      </div>
      <div style={{ gap: "5px", marginTop: "2rem", maxWidth: "320px" }}>
        <input
          type="text"
          value={fullName}
          placeholder="Full Name"
          onChange={(event) => setFullName(event.target.value)}
        />
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div style={{ alignSelf: "start", marginTop: "1rem" }}>
          <label className={styles.fileLabel} htmlFor="file">
            <img
              width={30}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: imageURL && "50%",
                objectFit: "cover",
              }}
              src={
                imageURL
                  ? imageURL
                  : "https://cdn-icons-png.flaticon.com/512/5053/5053024.png"
              }
            ></img>
            Add an avatar
          </label>
          <input
            name="file"
            type="file"
            id="file"
            style={{ display: "none" }}
            // onChange={(event) => setAvatar(event.target.files[0])}
            onChange={(event) => {
              const file = event.target.files[0];
              setAvatar(file);
              const imageURL = URL.createObjectURL(file);
              setImageURL(imageURL);
            }}
          />
        </div>
      </div>
      <button className={styles.authBtn} onClick={handleRegister}>
        Sign up
      </button>
      <p style={{ color: "#a7aaad", fontSize: "1rem", marginTop: "1.5rem" }}>
        Already have an account?{" "}
        <span
          style={{ color: "#2592ff", cursor: "pointer" }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Log in
        </span>
      </p>
    </div>
  );
};

export default Register;
