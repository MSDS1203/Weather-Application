import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Saved from "./pages/saved";
import MapComponent from "./pages/MapComponent";

function App() {
  return (
    <Router>
      <Navbar  />
      <Routes>
        <Route path = "/saved" element={<Saved/>} />
        <Route path = "/MapComponent" element={<MapComponent/>} />
      </Routes>
    </Router>
  )
}

export default App;

// import MapComponent from "./MapComponent";

// const App = () => {
//   return (
//       <div style={{ textAlign: "center", padding: "20px" }}>
//         <h1>Map of...</h1>
//         <MapComponent />
//       </div>
//   );
// };

// export default App;
