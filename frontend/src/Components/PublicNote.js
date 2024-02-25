import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PublicNote = () => {
  const navigate = useNavigate();
  const { publicIdentifier } = useParams();
  const [publicNote, setPublicNote] = useState(null);

  const handlePublish = async () => {
    const response = await fetch(
      // `https://notes-app-indol-kappa.vercel.app/api/v1/notes/viewNote/${publicIdentifier}`
      `http://localhost:4000/api/v1/notes/viewNote/${publicIdentifier}`
    );
    const json = await response.json();
    setPublicNote(json.data);
  };

  useEffect(() => {
    handlePublish();
  }, []);

  return (
    <div>
      {publicNote?.isPublic ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3rem",
            margin: "auto",
            height: "100vh",
          }}
        >
          <div className="publicNote">
            <p style={{ textAlign: "center" }}>{publicNote?.title}</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <img
              width={25}
              src="https://cdn-icons-png.flaticon.com/128/10335/10335740.png"
            />
            <span style={{ letterSpacing: "0.6px" }}>
              Published with Quicknote
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <p style={{ marginTop: "20rem", fontSize: "1.2rem" }}>
            Note is not public, log in to access the note
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <img
              width={25}
              style={{ marginBottom: "2rem" }}
              src="https://cdn-icons-png.flaticon.com/128/10335/10335740.png"
            />
            <span style={{ letterSpacing: "0.6px", marginBottom: "2rem" }}>
              Published with Quicknote
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicNote;
