/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from "react";

const WeatherDisplay = ({ lat, lon, isMetric }) => {
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

    // Conversions if isMetric is true
    const temp = isMetric ? (weather.main.temp - 32) * (5 / 9) : weather.main.temp; // Convert °F to °C
    const feelsLike = isMetric ? (weather.main.feels_like - 32) * (5 / 9) : weather.main.feels_like; // Convert °F to °C
    const windSpeed = isMetric ? weather.wind.speed * 0.44704 : weather.wind.speed; // Convert mph to m/s

    return (
        <div>
            <p style={{fontFamily: "Silkscreen", fontSize: "15px", textTransform: "uppercase"}}>12:00 AM - MONDAY</p>
            <p></p>
            <p style={{fontFamily: "Silkscreen", fontSize: '25px', textTransform: 'uppercase'}}>{weather.weather[0].description}</p>
            <p style={{fontFamily: "VT323", fontSize: '75px'}}><b>{temp.toFixed(1)}</b>{isMetric ? '°C' : '°F'}</p>
            <p style={{fontFamily: "Silkscreen", marginTop: '-60px', marginLeft: '-150px'}}><b>High:</b> text</p>
            <p style={{fontFamily: "Silkscreen", marginTop: '-34px', marginLeft: '150px'}}><b>Low:</b> text</p>
            <p style={{fontFamily: "Silkscreen", }}><b>Feels like:</b> {feelsLike.toFixed(1)}{isMetric ? '°C' : '°F'}</p>
            <p style={{fontFamily: "Silkscreen", marginTop: '120px'}}><b>Humidity:</b> {weather.main.humidity}%</p>
            <p style={{fontFamily: "Silkscreen", }}><b>Wind Speed:</b> {windSpeed.toFixed(1)}{isMetric ? 'm/s' : 'mph'}</p>
        </div>
    );
};

export default WeatherDisplay;