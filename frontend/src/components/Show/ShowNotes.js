import React, { useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./ShowNotes.css"
function ShowNotes() {
  const [title,setTitle]= useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const {id} = useParams(); 

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
      })
      .catch((e) => {
        console.log(e.message);
      });
  

  return (
    <div>
      <div className='NoteDescription'>
      <h2>{title}</h2>
      <br />
      <p>{content}</p>
      </div>
    </div>
  )
}

export default ShowNotes