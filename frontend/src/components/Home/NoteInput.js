import axios from "axios";
import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./Home.css";
function NoteInput() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();
    const note = { title, content };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_NOTEKEEP}/notes/create`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: note,
    }).then((res) => {
      console.log("New Note added");
      navigate("/dashboard");
    });
  };

  return (
    <div className="noteInputBox">
      <div className="mainNote">
        <form onSubmit={handleSubmit}>
          <div className="notediv">
            <input
              className="titleText"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              type="text"
            />
            <input
              className="descriptionText"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note Description"
            />
          </div>
          <hr style={{ margin: "16px" }} />
          <div style={{ display: "flex", justifyContent: "right" }}>
            <button type="submit" className="addBtn">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NoteInput;