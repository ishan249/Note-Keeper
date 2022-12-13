import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles.css";
const date = new Date().getHours();
let greet = "";

if (date > 6 && date < 12) {
  greet = "Morning";
} else if (date >= 12 && date < 18) {
  greet = "Afternoon";
} else if (date >= 18 && date <= 23) {
  greet = "Evening";
}

function Navbarpage() {
  const navigate = useNavigate();

  const [username, setUsername]= useState("");
  const token = localStorage.getItem("token");

  axios({
    url: `${process.env.REACT_APP_NOTEKEEP}/notes/me`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setUsername(res.data.username);
     ;
    })
    .catch((e) => {
      console.log(e.message);
    });

  const handleSignOut = () => {
    const token = localStorage.getItem("token");
   
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_NOTEKEEP}/user/logout`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      const isTokenExists = localStorage.getItem("token");
      if (isTokenExists) {
        localStorage.removeItem("token");
        navigate("/");
      }
    });
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem("token");
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_NOTEKEEP}/users/delete`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      console.log("user account deleted");
      localStorage.removeItem("token");
      navigate("/");
    });
  };

  return (
    <div>
      <header className="head">
        <div className="newHeader">
          <div className="headings">
            <p style={{ fontSize: "30px" }}>Note keeper</p>
            <p>Good {greet} {username}</p>
          </div>
          <div className="btnDiv">
            <button onClick={handleSignOut} className="btnss">
              Sign Out
            </button>
            <button onClick={handleDeleteAccount} className="btnss">
              Delete Account
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbarpage;
