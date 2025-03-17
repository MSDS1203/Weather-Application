import React, { useState } from "react";
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';

const Saved = () => {
    // Convert locations to a state variable
    const [locations, setLocations] = useState({
        "Cary": {
            "location": "Cary, North Carolina, US",
            "latitude": 35.7882893,
            "longitude": -78.7812081
        },
        "Greenville": {
            "location": "Greenville, North Carolina, US",
            "latitude": 35.613224,
            "longitude": -77.3724593
        }
    });

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