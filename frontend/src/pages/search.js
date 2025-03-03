import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./search.css";
import SearchBar from "../components/SearchBar.js";

const Search = () => {
    // State to hold the location data. Not necessary but keeping for possible future use.
    const [locationData, setLocationData] = useState(null);
    const navigate = useNavigate();

    const handleSelectLocation = (data) => {
        setLocationData(data); // Set the location data from the search bar
        if (data) {
            const { name, lat, lon } = data;
            navigate(`/weather/${encodeURIComponent(name)}/${lat}/${lon}`); // Navigate to WeatherInfo
        }
    };

    return (
        <div>
            <div>
                <Link to="/saved"><button style={{
                    position: 'absolute',
                    top: '23%',
                    right: '21%',
                    padding: '10px',
                    width: '210px'
                }}
                className={"button"}>SAVED LOCATIONS</button></Link>
                <button style={{
                    position: 'absolute',
                    top: '28%',
                    right: '21%',
                    padding: '10px',
                    width: '210px'
                }}
                className={"button"}>FAHRENHEIT / CELSIUS</button>
            </div>
            <div className="container">
                <SearchBar onSelect={handleSelectLocation} /> {/* Pass handleSelectLocation to SearchBar */}
            </div>
        </div>
    );
};


export default Search;