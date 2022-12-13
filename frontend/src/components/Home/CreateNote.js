import React from 'react'
import NoteInput from './NoteInput'
import Navbar from '../../pages/Navbar'
function CreateNote() {
  return (
    <div><Navbar/>
    <h3
        style={{
          color: "#002D62",
          fontFamily: "Albert Sans",
          margin: "20px 10px",
          textAlign:"center"
        }}
      >
      Create New Note
      </h3>
    <NoteInput/></div>
  )
}

export default CreateNote