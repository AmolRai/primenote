import React, { useEffect, useState } from "react";
import styles from "../styles/setting.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useCustomCookie from "../utils/useCustomCookie";

const Setting = ({ closeMenu }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const token = useCustomCookie();

  const getUser = async () => {
    const response = await fetch(
      `https://notes-app-indol-kappa.vercel.app/api/v1/users/getUser`,
      // `http://localhost:4000/api/v1/users/getUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await response.json();
    setUserData(json.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Settings</p>
          <img
            onClick={closeMenu}
            className={styles.cross}
            src="https://cdn-icons-png.flaticon.com/128/9684/9684650.png"
          />
        </div>
        <p
          style={{
            color: "#8C8F94",
            marginTop: "1rem",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          ACCOUNT
        </p>
        <div
          style={{
            border: "1px solid #2c3338",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "5px",
              color: "#b1b1b1",
            }}
          >
            <p>Full Name: {userData?.fullName}</p>
            <p>Username: {userData?.username}</p>
          </div>
          <div>
            <img src={userData?.avatar} className={styles.avatar} />
          </div>
        </div>
        <button className={styles.logout} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default Setting;
