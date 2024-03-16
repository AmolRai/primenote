import React, { useEffect, useState } from "react";
import styles from "../styles/noteDetails.module.css";

const NoteDetails = ({ myNote, closeNoteDetail }) => {
  const wordsArray = myNote?.title.split(/\s+/);
  const createdAtDate = new Date(myNote?.createdAt);
  const updatedAtDate = new Date(myNote?.updatedAt);
  const formattedCreatedAt = formatDate(createdAtDate);
  const formattedUpdatedAt = formatDate(updatedAtDate);

  function formatDate(date) {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-IN", options);
  }

  return (
    <div className="overlay">
      <div className="popup">
        <div className={styles.detailContainer}>
          <p style={{ fontWeight: "bolder" }}>Note Details</p>
          <img
            onClick={closeNoteDetail}
            className={styles.cross}
            src="https://cdn-icons-png.flaticon.com/128/9684/9684650.png"
          />
        </div>
        <div className={styles.noteDetails}>
          <div>
            <p>Created</p>
            <p style={{ color: "#8C8F94" }}>{formattedCreatedAt}</p>
          </div>
          <div>
            <p>Last Modified</p>
            <p style={{ color: "#8C8F94" }}>{formattedUpdatedAt}</p>
          </div>
          <div>
            <p>Words</p>
            <p style={{ color: "#8C8F94" }}>{wordsArray?.length}</p>
          </div>
          <div>
            <p>Characters</p>
            <p style={{ color: "#8C8F94" }}>{myNote?.title.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
