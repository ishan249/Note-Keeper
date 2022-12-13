import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Delete.css";
function DeleteNote() {
  const [titles, setTitle] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  axios({
    url: `${process.env.REACT_APP_NOTEKEEP}/notes/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setTitle(res.data.title);
    })
    .catch((e) => {
      console.log(e.message);
    });
  const handleYesDelete = async () => {
    await axios({
      url: `${process.env.REACT_APP_NOTEKEEP}/notes/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(navigate("/dashboard"));
  };
  const handleNoDelete = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <div className="mainDeletionPage">
        <div className="deleteDialog">
        <h3 className="deleteHead">
          Are you sure you want to delete this Note?
        </h3>
        <div className="noteTitle">Title: {titles}</div>
        <div className="delBtns">
          <button onClick={handleNoDelete} className="NoBtn">
            No
          </button>
          <button onClick={handleYesDelete} className="YesBtn">
            Yes
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteNote;
