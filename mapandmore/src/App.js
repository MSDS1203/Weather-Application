import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Saved from "./pages/saved";
import MapComponent from "./pages/MapComponent";
import Search from "./pages/search";

function App() {
  return (
    <Router>
      <Navbar  />
      <Routes>
        <Route path = "/saved" element={<Saved/>} />
        <Route path = "/MapComponent" element={<MapComponent/>} />
        <Route path = "/search" element={<Search/>} />
      </Routes>
    </Router>
  )
}

export default App;