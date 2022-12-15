import axios from "axios";
import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./Home.css";
import {motion} from "framer-motion";
function NoteInput() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const token = localStorage.getItem("token");
  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    const month = (date.getMonth())+1;
    const year = date.getFullYear();
    const todayDate = date.getDate();
    const timestamp = `${todayDate}/${month}/${year}`;
    const note = { title, content, timestamp };
    
    //saving a note in database with it's title, content and time on which it was created
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
    <motion.div
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition= {{duration:0.5}}
    className="noteInputBox">
      <div className="mainNote">
        <form onSubmit={handleSubmit}>
          <div className="notediv">
            <input
              className="titleText"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
            />
            <input
              className="descriptionText"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your Note here..."
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
    </motion.div>
  );
}
export default NoteInput;
