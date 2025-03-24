import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./search.css";
import SearchBar from "../components/SearchBar.js";

const Search = () => {
    // State to hold the location data. Not necessary but keeping for possible future use.
    const [locationData, setLocationData] = useState(null);
    const navigate = useNavigate();

    // Load unit preference from localStorage or default to false (imperial)
    const [isMetric, setIsMetric] = useState(() => {
        return localStorage.getItem("isMetric") === "true"; // Convert stored string to boolean
    });    
    
    // Toggle between metric and imperial
    const toggleUnits = () => {
        setIsMetric((prev) => {
            const newValue = !prev; // Toggle the value
            localStorage.setItem("isMetric", newValue); // Store the updated value
            return newValue;
        });
    };

    const handleSelectLocation = (data) => {
        setLocationData(data); // Set the location data from the search bar
        if (data) {
            const { name, lat, lon } = data;
            navigate(`/weather/${encodeURIComponent(name)}/${lat}/${lon}`); // Navigate to WeatherInfo
        }
    };

    return (
        <div className = {"searchCont"}>
            <div>
                <Link to="/saved"><button style={{
                    position: 'absolute',
                    top: '23%',
                    right: '21%',
                    padding: '10px',
                    width: '210px'
                }}
                className={"button"}>SAVED LOCATIONS</button></Link>
                <button onClick={toggleUnits} style={{
                    position: 'absolute',
                    top: '28%',
                    right: '21%',
                    padding: '10px',
                    width: '210px'
                }}
                className={"button"}>{isMetric ? "SWITCH TO IMPERIAL" : "SWITCH TO METRIC"}</button>
            </div>
            <div className="container">
                <SearchBar onSelect={handleSelectLocation} /> {/* Pass handleSelectLocation to SearchBar */}
            </div>
        </div>
    );
};


export default Search;