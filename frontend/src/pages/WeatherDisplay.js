import React, { useState, useEffect } from "react";
import styles from "./WeatherDisplay.module.css"; 


const WeatherDisplay = ({ lat, lon, location }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
                console.log(`Fetching weather data for lat: ${lat}, lon: ${lon}`);
                if (!response.ok) throw new Error("Failed to fetch weather data");

                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lon]);

    if (loading) return <p>Loading weather data...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            <h2>Weather in {weather.name}</h2>
            <p>Temperature: {weather.main.temp}°F</p>
            <p>Feels like: {weather.main.feels_like}°F</p>
            <p>Condition: {weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} mph</p>

            {/* Astronomy data at the bottom */}
            <weatherInfo location={location} />
        </div>
    );
};

export default WeatherDisplay;
