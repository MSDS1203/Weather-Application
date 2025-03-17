import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';

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
        <div>
            <h1>Saved Locations</h1>
            <div>
                {Object.entries(locations).map(([location, values]) => (
                    <div key={location} className="savedLoc">
                        <h3>{values.location}</h3>
                        <button type="button" onClick={() => unsaveLocation(location)}>
                            Unsave Location
                        </button>
                        <WeatherDisplay lat={values.latitude} lon={values.longitude} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Saved;