import React, { useState } from "react";
import axios from "axios";

const Search = () => {
    const [cityQuery, setCityQuery] = useState("");
    const [zipQuery, setZipQuery] = useState("");
    const [cityResults, setCityResults] = useState([]);
    const [zipResult, setZipResult] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch city search results
    const searchCity = async () => {
        if (!cityQuery) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/citySearch?q=${cityQuery}`);
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
            const response = await axios.get(`http://localhost:8000/zipSearch?q=${zipQuery}`);
            setZipResult(response.data);
        } catch (error) {
            console.error("Error fetching ZIP data:", error);
        }
        setLoading(false);
    };

    // Fetch weather data
    const getWeather = async (lat, lon, unit = "imperial") => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/weather?lat=${lat}&lon=${lon}&unit=${unit}`);
            setWeather(response.data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
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
                            {city.name}, {city.state}, {city.country} 
                            <button onClick={() => getWeather(city.lat, city.lon)}>Get Weather</button>
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
                    <p>Coordinates: {zipResult.lat}, {zipResult.lon}</p>
                    <button onClick={() => getWeather(zipResult.lat, zipResult.lon)}>Get Weather</button>
                </div>
            )}

            {/* Weather Display */}
            {weather && (
                <div>
                    <h3>Weather Info</h3>
                    <p>Temperature: {weather.temp}°</p>
                    <p>Condition: {weather.description}</p>
                    <p>Humidity: {weather.humidity}%</p>
                </div>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
};

export default Search;