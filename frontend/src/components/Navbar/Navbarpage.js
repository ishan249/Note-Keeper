import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles.css";
import user from "../../images/user (1).png";
const date = new Date().getHours();
let greet = "";

if (date >= 0 && date < 12) {
  greet = "Morning";
} else if (date >= 12 && date < 18) {
  greet = "Afternoon";
} else if (date >= 18 && date <= 23) {
  greet = "Evening";
}

function Navbarpage() {
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("refreshToken");
  
  // Using get request to get username to greet the user in navbar

  axios({
    url: `${process.env.REACT_APP_NOTEKEEP}/users/me`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setUsername(res.data.username);
    })
    .catch((e) => {
      console.log(e.message);
    });


  //handling signout and delete account events

  const handleSignOut = () => {
    const token= localStorage.getItem("refreshToken");
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_NOTEKEEP}/user/logout`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
    }).then(() => {
      const isTokenExists = localStorage.getItem("refreshToken");
      if (isTokenExists) {
        localStorage.removeItem("refreshToken");
        navigate("/");
      }
    }).catch((e)=>{
      console.log(e);
      console.log("Reaching here and give up");
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


  //using toggle function to toggle state value to show signout/deleteaccount options on clicking account photo
  const toggle = (e) => {
    e.preventDefault();
    console.log(state);
    setState(!state);
  };

  return (
    <div>
      <header style={{ height: "160px" }} className="head">
        <div className="newHeader">
          <div className="headings">
            <p style={{ fontSize: "34px" }}>Note keeper</p>
            <p>
              Good {greet} {username}
            </p>
          </div>
          <div className="btnDiv">
            <button
              onClick={toggle}
              style={{
                background: "none",
                border: "none",
                height: "40px",
                width: "60px",
              }}
            >
              <img
                style={{
                  borderRadius: "50%",
                  background: "white",
                  height: "44px",
                  width: "44px",
                  align: "center",
                }}
                src={user}
                alt=""
              />
            </button>

            {state ? (
              <div
                style={{
                  backgroundColor: "white",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  borderRadius: "8px",
                  marginTop:"10px"
                }}
              >
                <button className="btnss" onClick={handleSignOut}>
                  Log Out
                </button>
                <hr />
                <button className="btnss" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbarpage;
