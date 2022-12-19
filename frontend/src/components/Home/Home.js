import axios from "axios";
import React, { useEffect, useState } from "react";
import "./note.css";
import "./Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
function Home() {

  axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error)=>{
    Promise.reject(error);
  }
  );




  axios.interceptors.response.use((response)=>{
    return response;
  }, function(error){
    const originalRequest = error.config;
    let refreshToken = localStorage.getItem("refreshToken");
    if(refreshToken && error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry= true;
      return axios.post(`${process.env.REACT_APP_NOTEKEEP}/user/generateRefreshToken`, {refreshToken:refreshToken}).then((res)=>{
        if(res.status===200){
          localStorage.setItem("token", res.data.token);
          console.log("token refreshed");
          return axios(originalRequest);
        }
      });
    }
    return Promise.reject(error);
  })

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
      {/* checking if Notes are there or not */}
      {!noteList ||
        (noteList.length === 0 && <h2 className="NoFound">No Notes Found</h2>)}
      <div>
        {noteList && (
          // if notes are there mapping it to a div
          <div className="NotesArea">
            {noteList &&
              noteList.map((note, i) => (
                <Link
                  to={`/notes/${note._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="noteBox"
                  >
                    {/* if note title string is bigger than 20 than create substring of 20 character followed by ... */}
                    {note.title.length > 20 ? (
                      <h3>{note.title.substring(0, 20) + "....."}</h3>
                    ) : (
                      <h3>{note.title}</h3>
                    )}
                    <div className="content">
                      {/* checking if note description has length greater than 70 or not if more than 70 render ... */}

                      {note.content.length > 50 ? (
                        <p>{note.content.substring(0, 50) + "....."}</p>
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
