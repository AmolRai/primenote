import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/home.module.css";
import Dropdown from "./Dropdown";
import Search from "./Search";
import Setting from "./Setting";
import useCustomCookie from "../utils/useCustomCookie";

const Home = () => {
  const [title, setTitle] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [filterNotes, setFilterNotes] = useState([]);
  const [myNote, setMyNote] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [publicIdentifier, setPublicIdentifier] = useState("");
  const [isMenuSelected, setIsMenuSelected] = useState(false);
  const [pinNote, setPinNote] = useState(null);
  const [settingOpen, setSettingOpen] = useState(false);
  const [timer, setTimer] = useState();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const token = useCustomCookie();

  const saveNotesInDB = async (noteTitle) => {
    setLoading(true);
    const postData = {
      title: noteTitle,
      filterNotes: filterNotes,
    };

    const response = await fetch(
      "https://primenote-api.vercel.app/api/v1/notes/addNote",
      // "http://localhost:4000/api/v1/notes/addNote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(postData),
      }
    );
    const json = await response.json();
    setLoading(false);
    fetchAllNotes();
  };

  const handleUpdateNote = async (id, noteTitle) => {
    const putData = {
      id: id,
      title: noteTitle,
    };

    const response = await fetch(
      "https://primenote-api.vercel.app/api/v1/notes/updateNote",
      // "http://localhost:4000/api/v1/notes/updateNote",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putData),
      }
    );
    const json = await response.json();
    fetchAllNotes();
  };

  const fetchAllNotes = async () => {
    try {
      if (!edit) {
        setLoading(true);
      }
      const response = await fetch(
        "https://primenote-api.vercel.app/api/v1/notes/allNotes",
        // "http://localhost:4000/api/v1/notes/allNotes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      // setEdit(false);
      setLoading(false);
      if (json.data.length === 0) {
        saveNotesInDB("New Note...", false);
      }

      if (!myNote) {
        const data = json.data;
        setMyNote(data[0]);
        setTitle(data[0].title);
      }
      setAllNotes(json.data);
      setFilterNotes(json.data);
    } catch (error) {
      setLoading(false);
      console.log("Error while fetching the notes", error.message);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await fetch(
      "https://primenote-api.vercel.app/api/v1/notes/deleteNote",
      // "http://localhost:4000/api/v1/notes/deleteNote",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      }
    );
    const json = await response.json();
    setLoading(false);
    fetchAllNotes();
  };

  const handleComplete = async (id, isComplete) => {
    setLoading(true);
    const putData = {
      id: id,
      isComplete: !isComplete,
    };
    const response = await fetch(
      "https://primenote-api.vercel.app/api/v1/notes/updateCompleteNote",
      // "http://localhost:4000/api/v1/notes/updateCompleteNote",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putData),
      }
    );
    const json = await response.json();
    setLoading(false);
    setMyNote(json.data);
    fetchAllNotes();
  };

  useEffect(() => {
    const handlePublish = async (publicIdentifier) => {
      setLoading(true);
      if (!publicIdentifier) return;

      const data = {
        publicIdentifier: publicIdentifier,
        isPublic: isPublic,
      };
      const response = await fetch(
        "https://primenote-api.vercel.app/api/v1/notes/publicNote",
        // "http://localhost:4000/api/v1/notes/publicNote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      setLoading(false);
      setMyNote(json.data);
      fetchAllNotes();
    };
    handlePublish(publicIdentifier);
  }, [publicIdentifier, isPublic]);

  const handleSingleNoteClick = (note) => {
    setTitle(note.title);
    setMyNote(note);
  };

  const handleAddNewNote = () => {
    saveNotesInDB("New Note...", false);
  };

  const pinToTop = async (notePin) => {
    setLoading(true);
    const putData = {
      id: notePin._id,
      pinNote: !notePin.pinNote,
    };
    const response = await fetch(
      "https://primenote-api.vercel.app/api/v1/notes/updateNote",
      // "http://localhost:4000/api/v1/notes/updateNote",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putData),
      }
    );
    const json = await response.json();
    setLoading(false);
    setMyNote(json.data);
    await fetchAllNotes();
    setPinNote(json.data);
  };

  useEffect(() => {
    const userNotes = [];

    if (pinNote) {
      if (pinNote.pinNote) {
        userNotes.push(pinNote);
      }
    }

    allNotes?.forEach((note) => {
      if (note.pinNote && note?._id !== pinNote?._id) {
        userNotes.push(note);
      }
    });
    allNotes?.forEach((note) => {
      if (!note.pinNote) {
        userNotes.push(note);
      }
    });

    setFilterNotes(userNotes);
    setPinNote(null);
  }, [allNotes]);

  const handleSearch = (userSearchText) => {
    const filterNotes = allNotes.filter((note) => {
      return note.title.toLowerCase().includes(userSearchText.toLowerCase());
    });
    setFilterNotes(filterNotes);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchAllNotes();
    }
  }, []);

  const handleDebounce = (value) => {
    setEdit(true);
    setTitle(value);
    if (timer) {
      clearTimeout(timer);
    }

    let tempTimer = setTimeout(() => {
      handleUpdateNote(myNote?._id, value);
    }, 300);
    setTimer(tempTimer);
  };

  return (
    <div className={styles.home} onClick={() => setIsMenuSelected(false)}>
      {settingOpen && <Setting closeMenu={() => setSettingOpen(false)} />}
      {loading && (
        <div className="lds-ring ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <div className={styles.header}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            height: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: "1",
              height: "50px",
              borderRight: "0.5px solid #5e5e5ea2",
              marginRight: "3px",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <img
              style={{
                filter: "invert(1)",
                width: "1.3rem",
                opacity: "0.6",
                cursor: "pointer",
              }}
              onClick={() => setSettingOpen(true)}
              src="https://cdn-icons-png.flaticon.com/128/2040/2040504.png"
            />
            <p>All Notes</p>
            <img
              style={{
                filter: "invert(1)",
                width: "1.5rem",
                marginRight: "1rem",
                cursor: "pointer",
                opacity: "0.6",
              }}
              onClick={() => handleAddNewNote()}
              src="https://cdn-icons-png.flaticon.com/128/11366/11366824.png"
            />
          </div>
          <div
            style={{
              flex: "3",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              marginRight: "1rem",
            }}
          >
            <img
              style={{ filter: "invert(1)", opacity: "0.7" }}
              onClick={(eve) => {
                setIsMenuSelected(!isMenuSelected);
                eve.stopPropagation();
              }}
              width={20}
              src="https://cdn-icons-png.flaticon.com/128/570/570223.png"
            />

            {isMenuSelected && (
              <Dropdown
                dismissMenu={() => setIsMenuSelected(false)}
                myNote={myNote}
                handleDelete={() => handleDelete(myNote?._id)}
                pinToTop={() => pinToTop(myNote)}
                handleComplete={() =>
                  handleComplete(myNote?._id, myNote?.isComplete)
                }
                setIsPublic={() => setIsPublic(!myNote?.isPublic)}
                setPublicIdentifier={() =>
                  setPublicIdentifier(myNote?.publicIdentifier)
                }
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.notes}>
        <div className={styles.homeLeft}>
          <Search handleSearch={handleSearch} />
          {filterNotes?.map((note) => {
            return (
              <div
                className={styles.singleNote}
                key={note._id}
                style={{
                  height: "4rem",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "2rem",
                  paddingTop: "2rem",
                  paddingBottom: "2rem",
                  cursor: "pointer",
                  borderBottom: "0.1px solid #5e5e5ea2",
                  backgroundColor: myNote?._id === note?._id ? "#3361cc66" : "",
                }}
                onClick={() => handleSingleNoteClick(note)}
              >
                {note.pinNote && (
                  <img
                    style={{
                      width: "1.3rem",
                      filter: "invert(1)",
                      position: "relative",
                      opacity: "0.6",
                      top: "-1rem",
                      right: "1.5rem",
                    }}
                    src="https://cdn-icons-png.flaticon.com/128/2672/2672101.png"
                  />
                )}
                <div
                  style={{
                    marginLeft: note.pinNote && "-1.3rem",
                  }}
                >
                  <p
                    style={{
                      textDecoration: note.isComplete ? "line-through" : "",
                      height: "1.3rem",
                      overflow: "hidden",
                    }}
                  >
                    {note.title.length <= 35
                      ? note.title
                      : note.title.substring(0, 35) + "..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.homeRight}>
          <textarea
            type="text"
            value={title}
            spellCheck={false}
            onChange={(event) => {
              const value = event.target.value;
              handleDebounce(value);
            }}
          />
          <div style={{ position: "absolute", bottom: "1rem", right: "30rem" }}>
            <p style={{ color: "#ffffffc4" }}>Made with ❤️ by Amol Rai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
