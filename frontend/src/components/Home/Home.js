import axios from "axios";
import React, { useEffect, useState } from "react";
import "./note.css";
import { Link } from "react-router-dom";
import "./Home.css";
import {motion} from "framer-motion"
function Home() {
  const [noteList, setNotes] = useState([]);

  const callFn = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_NOTEKEEP}/notes/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNotes(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    callFn();
  }, []);

  useEffect(() => {
    callFn();
  }, [setNotes]);

  return (
    <div>
      <Link to={"/create"}>
        <button className="createBtn">+ New Note</button>
      </Link>
      <h2
        style={{
          color: "#002D62",
          fontFamily: "Albert Sans",
          margin: "20px 10px",
          textAlign: "center",
        }}
      >
        Your Notes
      </h2>
      {!noteList ||
        (noteList.length === 0 && <h2 className="NoFound">No Notes Found</h2>)}
      <div>
        {noteList && (
          <div
          className="NotesArea">
            {noteList &&
              noteList.map((note,i) => (
                <Link
                  to={`/notes/${note._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5,delay:i*0.1}}
                  className="noteBox">
                    <h3>{note.title}</h3>
                    <div className="content">
                      {note.content.length > 70 ? (
                        <p>{note.content.substring(0, 70) + "....."}</p>
                      ) : (
                        <p>{note.content}</p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "30px",

                        bottom: "0",
                      }}
                    >
                      <div>{note.timestamp}</div>
                      <div>
                        <Link to={`/delete/${note._id}`}>
                          <span className="deleteBtn">Delete</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
