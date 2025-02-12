import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Search = () => {
    const [cityQuery, setCityQuery] = useState("");
    const [zipQuery, setZipQuery] = useState("");
    const [cityResults, setCityResults] = useState([]);
    const [zipResult, setZipResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch city search results
    const searchCity = async () => {
        if (!cityQuery) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/citySearch?q=${cityQuery}`);
            setCityResults(response.data);
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
        setLoading(false);
    };

    // Fetch ZIP search results
    const searchZip = async () => {
        if (!zipQuery) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/zipSearch?q=${zipQuery}`);
            setZipResult(response.data);
        } catch (error) {
            console.error("Error fetching ZIP data:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Weather App</h2>

            {/* City Search */}
            <div>
                <input type="text" value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} placeholder="Search city..." />
                <button onClick={searchCity}>Search</button>
            </div>
            {cityResults.length > 0 && (
                <ul>
                    {cityResults.map((city, index) => (
                        <li key={index}>
                            {city.location}, {city.latitude}, {city.longitude} 
                            <button onClick={() => navigate(`/weather/${encodeURIComponent(city.location)}/${city.latitude}/${city.longitude}`)}>Get Weather</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ZIP Code Search */}
            <div>
                <input type="text" value={zipQuery} onChange={(e) => setZipQuery(e.target.value)} placeholder="Enter ZIP code..." />
                <button onClick={searchZip}>Search</button>
            </div>
            {zipResult && (
                <div>
                    <p>Coordinates: {zipResult.latitude}, {zipResult.longitude}</p>
                    <button /*onClick={() => getWeather(zipResult.lat, zipResult.lon)}*/>Get Weather</button>
                </div>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
};

export default Search;