import React from "react";
import { Link } from 'react-router-dom';
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';
import image from './wi-day-sunny.svg';

const Saved = () => {
    const locations = {
        "Cary": {
            "city":"Cary, NC",
            "country":"US", 
            "latitude":35.7882893,
            "longitude":-78.7812081
        },
        "Greenville": {
            "city":"Greenville, NC",
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
                    <p style={{fontSize: "40px", fontWeight: '500', marginBottom: '-15px'}}>{values.city}, {values.country}</p>
                    <WeatherDisplay lat={values.latitude} lon={values.longitude} />
                    <button style= {{
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