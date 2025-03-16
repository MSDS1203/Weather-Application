/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from "react";

const WeatherDisplay = ({ lat, lon }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
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
        <div>
            <p>12:00 AM - MONDAY</p>
            <p></p>
            <p style={{fontSize: '35px', textTransform: 'uppercase'}}>{weather.weather[0].description}</p>
            <p style={{fontSize: '75px'}}>{weather.main.temp}°F</p>
            <p style={{marginTop: '-60px'}}>High: text</p>
            <p>Low: text</p>
            <p>Feels like: {weather.main.feels_like}°F</p>
            <p style={{marginTop: '80px'}}>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} mph</p>
        </div>
    );
};

export default WeatherDisplay;