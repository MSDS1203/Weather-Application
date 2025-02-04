import React from "react";
import MapComponent from "./MapComponent";
import NavigationBar from "./NavBar";

const App = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Map of...</h1>
      <MapComponent />
    </div>
  );
};

export default App;
