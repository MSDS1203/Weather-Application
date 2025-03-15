import React from "react";
import { Link } from 'react-router-dom';
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';

const Saved = () => {
    const locations = {
        "Cary": {
            "city":"Cary",
            "state":"NC",
            "country":"US", 
            "latitude":35.7882893,
            "longitude":-78.7812081
        },
        "Greenville": {
            "city":"Greenville",
            "state":"NC",
            "country":"US",
            "latitude":35.613224,
            "longitude":-77.3724593
        }
    };

    const unsaveLocation = (key) => {
        
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
                    <h1>{values.city}, {values.state}, {values.country}</h1>
                    <WeatherDisplay lat={values.latitude} lon={values.longitude} />
                    <button style= {{
                        position: "relative",
                        top: "-83%",
                        left: "-53%"
                    }}
                    className={"removeLoc"}>X</button>
                </div>
            ))}
        </div>
    );
};

export default Saved;