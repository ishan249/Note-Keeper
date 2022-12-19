import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signinpage.css";
import Header from "./Header";
function Signinpage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogIn = (e)=>{
        e.preventDefault();

        const user = {username, password};
        
        axios({
            method:"POST",
            url : `${process.env.REACT_APP_NOTEKEEP}/user/login`,
            header:{
                "Content-Type":"application/json",
            },
            data:user,
        }).then((res)=>{
            console.log("user logged in");
            const token = res.data.token;
            const refreshToken = res.data.refreshToken;
            console.log(token, refreshToken);
            localStorage.setItem("token",token);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            navigate("/dashboard");
        }).catch((e)=>{
            alert(e);
            console.log("Authentication Failed");
            setUsername("");
            setPassword("");
        })
    };

    const handleRegister= (e) =>{
        e.preventDefault();
        const user = {username, password};
        console.log(user);
        axios({
            method:"POST",
            url:`${process.env.REACT_APP_NOTEKEEP}/users/create`,
            headers:{
                'Content-Type': 'application/json'
            },
            data:user,

        }).then((res)=>{
            console.log("new user created");
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            navigate("/dashboard");

        }).catch((e)=>{
            alert(e);
            setUsername("");
            setPassword("");
        })
    }

  return (
    <div>
      <Header />
      <div className="main-container">
        <div className="container">
          <form action="">
            <div>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                required
                value={username}
                placeholder="Username"
              />
            </div>
            <div>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                value={password}
                type="password"
                placeholder="Password"
              />
            </div>

            <button onClick={handleLogIn} className="btns">Log in</button>
            <button onClick={handleRegister} className="btns">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signinpage;
