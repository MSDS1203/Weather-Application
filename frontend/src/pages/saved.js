import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';
import image from './wi-day-sunny.svg';

const Saved = () => {
    // Convert locations to a state variable
    const [locations, setLocations] = useState({});

    // Fetch saved locations from the server when the component mounts
    useEffect(() => {
        const fetchSavedLocations = async () => {
            try {
                console.log("Fetching saved locations...");
                const response = await axios.get("/saved-locations");
                console.log("Response from server:", response.data);
                const savedLocations = response.data.reduce((acc, loc) => {
                    acc[loc.location] = {
                        location: loc.location,
                        latitude: loc.lat,
                        longitude: loc.lon,
                    };
                    return acc;
                    
                }, {});
                console.log("Saved locations:", savedLocations);
                setLocations(savedLocations);
            } catch (error) {
                console.error("Error fetching saved locations:", error);
            }
        };
        fetchSavedLocations();
    }, []);

    // Function to unsave a location
    const unsaveLocation = (key) => {
        // Create a copy of the locations object
        const updatedLocations = { ...locations };
        // Remove the location with the given key
        delete updatedLocations[key];
        // Update the state with the new locations object
        setLocations(updatedLocations);
    };

    return (
        <div className={"container"}>
            <Link to="/search"><button style={{
                position: 'absolute',
                top: '5%',
                right: '5%',
                padding: '10px',
                width: '210px'
            }}
            className={"button"}>BACK</button></Link>
            {Object.entries(locations).map(([location, values]) => (
                <div key={location} className = "savedLoc">
                    <p style={{fontSize: "40px", fontWeight: '500', marginBottom: '-15px'}}>{values.location}</p>
                    <WeatherDisplay lat={values.latitude} lon={values.longitude} />
                    <button onClick={() => unsaveLocation(location)} style= {{
                        position: "relative",
                        top: "-92%",
                        left: "-41.5%"
                        }} className={"removeLoc"}>X</button>
                    <img src={image} alt="placeholder" style={{
                        position: "relative",
                        width: '80px',
                        height: '80px',
                        top: '-97.5%',
                        left: '-58%'
                        }} />
                </div>
            ))}
        </div>
    );
};

export default Saved;