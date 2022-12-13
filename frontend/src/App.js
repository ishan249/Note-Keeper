import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles.css';
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./components/Home/CreateNote";
import Delete from "./pages/Delete";
import ShowNote from "./pages/ShowNote";
function App() {
  const token = localStorage.getItem("token");
  return (
  <div>
    <BrowserRouter>
    <Routes>
      <Route path = "/" element= {<Signin/>}/>
      <Route path = "/dashboard" element= {<Dashboard/>}/>
      <Route path = "/create" element={<CreateNote/>}/>
      <Route path="/delete/:id" element={<Delete/>} />
      <Route path= "/notes/:id" element={<ShowNote/>}/>
    </Routes>
    
    </BrowserRouter>

   </div>
  );
}

export default App;