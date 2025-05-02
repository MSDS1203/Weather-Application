import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./search.css";
import SearchBar from "../components/SearchBar.js";
import { getStoredUnitChoice, toggleUnitChoice } from "../utils.js";

const Search = () => {
    // State to hold the location data. Not necessary but keeping for possible future use.
    const [locationData, setLocationData] = useState(null);
    const navigate = useNavigate();

    // Load unit preference from localStorage
    const [isMetric, setIsMetric] = useState(getStoredUnitChoice());

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
                <Link to="/saved"><button style={{position: 'absolute', top: '23%', right: '21%', padding: '10px'}} className={"button"}>SAVED LOCATIONS</button></Link>
                <button onClick={() => toggleUnitChoice(setIsMetric)} style={{position: 'absolute', top: '28%', right: '21%', padding: '10px'}} className={"button"}>{isMetric ? "SWITCH TO IMPERIAL" : "SWITCH TO METRIC"}</button>
            </div>
            
            
            <div className = {"weathAl"} style = {{position: 'relative', top: '170px', width: '33%', height: '110px', borderRadius: '20px'}}>
                <p style={{ fontFamily: "Silkscreen", marginTop: '15px', fontSize: "60px", fontWeight: '500' }}>WEATHER VALLEY</p>
            </div>

            <div className="container">
                <SearchBar onSelect={handleSelectLocation} /> {/* Pass handleSelectLocation to SearchBar */}
            </div>
        </div>
    );
};


export default Search;