import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Size of the map
const containerStyle = {
  width: "100%",
  height: "400px",
};

// Set location
const location = {
  lat: 35.791538, 
  lng:  -78.781120,
};

const MapComponent = () => {

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={12}>
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
