import React from "react";
import styles from "../styles/dropDown.module.css";

const Dropdown = ({
  dismissMenu,
  myNote,
  handleDelete,
  handleComplete,
  setIsPublic,
  setPublicIdentifier,
  pinToTop,
}) => {
  return (
    <div className={styles.dropDown}>
      <span
        className={styles.pin}
        onClick={(e) => {
          e.stopPropagation();
          pinToTop(myNote);
        }}
      >
        {myNote.pinNote ? "Unpin" : "Pin to top"}
      </span>
      <span
        className={styles.done}
        onClick={(e) => {
          e.stopPropagation();
          handleComplete(myNote?._id, myNote?.isComplete);
        }}
      >
        {myNote?.isComplete ? "Undone" : "Done"}
      </span>

      <div
        className={styles.publish}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            setIsPublic();
            setPublicIdentifier();
          }}
        >
          {myNote?.isPublic ? "Unpublish" : "Publish"}
        </span>
      </div>

      <span
        className={styles.copyLink}
        style={{ color: myNote?.isPublic ? "white" : "#646970" }}
        onClick={(e) => {
          e.stopPropagation();
          if (myNote?.isPublic) {
            navigator.clipboard.writeText(
              `https://primenote.vercel.app/viewNote/${myNote?.publicIdentifier}`
              // `http://localhost:3000/viewNote/${myNote?.publicIdentifier}`
            );
          }
        }}
      >
        Copy Link
      </span>

      <span
        className={styles.delete}
        style={{
          color: "#ff8085",
          borderTop: "0.1px solid #5e5e5ea2",
          marginTop: "10px",
          paddingTop: "9px",
          paddingBottom: "9px",
        }}
        onClick={() => {
          handleDelete(myNote._id);
          dismissMenu();
        }}
      >
        Delete
      </span>
    </div>
  );
};

export default Dropdown;
