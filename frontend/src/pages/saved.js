import React from "react";
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';

const Saved = () => {
    const locations = {
        "Cary": {
            "location":"Cary, North Carolina, US",
            "latitude":35.7882893,
            "longitude":-78.7812081
        },
        "Greenville": {
            "location":"Greenville, North Carolina, US",
            "latitude":35.613224,
            "longitude":-77.3724593
        }
    };

    const unsaveLocation = (key) => {
        
    };

    return (
        <div>
            <h1>Saved Locations</h1>
            <div>
                {Object.entries(locations).map(([location, values]) => (
                    <div key={location} className = "savedLoc">
                        <h3>{values.location}</h3>
                        <button type="button">Unsave Location</button>
                        <WeatherDisplay lat={values.latitude} lon={values.longitude} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Saved;