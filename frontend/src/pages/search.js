import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "../App.module.css";


const Search = () => {
    const [query, setQuery] = useState(""); // Combined query state
    const [results, setResults] = useState([]); // Combined results state
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;
    
        setLoading(true);
        try {
            let combinedResults = [];
    
            // 1. Check if the query looks like a ZIP code first
            if (/^\d{5}(-\d{4})?$/.test(query)) {
                try {
                    const zipResponse = await axios.get(`http://localhost:3001/zipSearch?q=${query}`);
                    if (zipResponse.data) { // Check if zipResponse has data
                        combinedResults.push({ ...zipResponse.data, type: 'zip' });
                    }
                } catch (zipError) {
                    console.error("Error fetching ZIP data:", zipError);
                    //If zip fails, it might be a city
                    try {
                        const cityResponse = await axios.get(`http://localhost:3001/citySearch?q=${query}`);
                        if (cityResponse.data.length > 0) {
                            combinedResults.push(...cityResponse.data.map(city => ({ ...city, type: 'city' })));
                        }
                    } catch (cityError) {
                        console.error("Error fetching city data:", cityError);
                    }
                }
            } else { // It's probably a city name
                try {
                    const cityResponse = await axios.get(`http://localhost:3001/citySearch?q=${query}`);
                    if (cityResponse.data.length > 0) {
                        combinedResults.push(...cityResponse.data.map(city => ({ ...city, type: 'city' })));
                    }
                } catch (cityError) {
                    console.error("Error fetching city data:", cityError);
                    //If city fails, it might be a zip, but we already tried
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

            <div>
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
                                    <button onClick={() => navigate(`/weather/${encodeURIComponent(result.location)}/${result.latitude}/${result.longitude}`)}>
                                        Get Weather
                                    </button>
                                </>
                            ) : (
                                <>
                                    Coordinates: {result.latitude}, {result.longitude} (ZIP)
                                    <button /* onClick={() => getWeather(result.lat, result.lon)} */>
                                        Get Weather
                                    </button>
                                </>
                            )}

                        </li>
                    ))}
                </ul>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
};

export default Search;