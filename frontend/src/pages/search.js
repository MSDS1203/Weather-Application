import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "../App.module.css";
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
        <div className={styles.container}>
            <h2>Weather App</h2>

            <SearchBar onSelect={handleSelectLocation} /> {/* Pass handleSelectLocation to SearchBar */}
        </div>
    );
};


export default Search;