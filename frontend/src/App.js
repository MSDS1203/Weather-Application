import React from "react";
import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Saved from "./pages/saved";
import Home from "./pages/search";
import WeatherInfo from "./pages/weatherInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/saved" element={<Saved/>} />
        <Route path = "/" element={<Home />} />
        <Route path="/weather/:location/:lat/:lon" element={<WeatherInfo />} />
      </Routes>
    </Router>
  )
}

export default App;