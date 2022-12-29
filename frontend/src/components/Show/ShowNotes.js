import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import "./ShowNotes.css";
function ShowNotes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [timestamp, setTime] = useState("");

  const token = localStorage.getItem("token");
  const { id } = useParams();

  axios({
    url: `${process.env.REACT_APP_NOTEKEEP}/notes/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setTime(res.data.timestamp);
    })
    .catch((e) => {
      console.log(e.message);
    });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, marginLeft: "0px" }}
        animate={{ opacity: 1, marginLeft: "20px" }}
        transition={{ duration: 0.5 }}
        className="NoteDescription"
      >
        <h2>{title}</h2>
        <span style={{ fontSize: "18px" }}>{timestamp}</span>
        <br />
        <br />
        <p>{content}</p>
      </motion.div>
    </div>
  );
}

export default ShowNotes;
