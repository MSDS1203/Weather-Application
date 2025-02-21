import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "../App.module.css";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;
    
        setLoading(true);
        try {
            let combinedResults = [];
    
            if (/^\d{5}(-\d{4})?$/.test(query)) {
                try {
                    const zipResponse = await axios.get(`http://localhost:3001/zipSearch?q=${query}`);
                    if (zipResponse.data) {
                        combinedResults.push({ ...zipResponse.data, type: 'zip' });
                    }
                } catch (zipError) {
                    console.error("Error fetching ZIP data:", zipError);
                    try {
                        const cityResponse = await axios.get(`http://localhost:3001/citySearch?q=${query}`);
                        if (cityResponse.data.length > 0) {
                            combinedResults.push(...cityResponse.data.map(city => ({ ...city, type: 'city' })));
                        }
                    } catch (cityError) {
                        console.error("Error fetching city data:", cityError);
                    }
                }
            } else {
                try {
                    const cityResponse = await axios.get(`http://localhost:3001/citySearch?q=${query}`);
                    if (cityResponse.data.length > 0) {
                        combinedResults.push(...cityResponse.data.map(city => ({ ...city, type: 'city' })));
                    }
                } catch (cityError) {
                    console.error("Error fetching city data:", cityError);
                }
            }
    
            setResults(combinedResults);
    
        } catch (error) {
            console.error("General Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Weather App</h2>

            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter city or ZIP code..."
                />
                <button className={styles.button} onClick={handleSearch}>Search</button>
            </div>

            {results.length > 0 && (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            {result.type === 'city' ? (
                                <>
                                    {result.location}, {result.latitude}, {result.longitude}
                                    <button className={styles.button} onClick={() => navigate(`/weather/${encodeURIComponent(result.location)}/${result.latitude}/${result.longitude}`)}>
                                        Get Weather
                                    </button>
                                </>
                            ) : (
                                <>
                                    Coordinates: {result.latitude}, {result.longitude} (ZIP)
                                    <button className={styles.button} /* onClick={() => getWeather(result.lat, result.lon)} */>
                                        Get Weather
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {loading && <p className={styles.loading}>Loading...</p>}
        </div>
    );
};

export default Search;