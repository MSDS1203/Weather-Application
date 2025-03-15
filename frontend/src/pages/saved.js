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
            <button style={{
                    position: 'absolute',
                    top: '23%',
                    right: '21%',
                    padding: '10px',
                    width: '210px'
                }}
                className={"button"}>BACK</button>
            <div classname={"container"}>
                {Object.entries(locations).map(([location, values]) => (
                    <div key={location} className = "savedLoc">
                        <h3>{values.location}</h3>
                        <button classname={"button"}>Unsave Location</button>
                        <WeatherDisplay lat={values.latitude} lon={values.longitude} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Saved;