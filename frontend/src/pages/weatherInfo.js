import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const API_KEY = "DZQTE9HYT64JDRCBJBZR9DBJ9";
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const WeatherInfo = () => {
    const { location, lat, lon } = useParams();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [astronomyData, setAstronomyData] = useState(null);
    const [error, setError] = useState(null);
    const containerStyle = {
        width: "60%",
        height: "400px",
      };      

      const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
    });

    useEffect(() => {
        const fetchAstronomyData = async () => {
            try {
                const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?key=${API_KEY}`);
                const data = await response.json();

                if (!data.days || data.days.length === 0) {
                    throw new Error("No astronomical data found.");
                }

                const { sunrise, sunset, moonphase } = data.days[0];
                setAstronomyData({ sunrise, sunset, moonphase });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAstronomyData();
    }, [location]);

    useEffect(() => {
        const getWeather = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/weather?lat=${lat}&lon=${lon}&unit=imperial`);
                setWeather(response.data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
            setLoading(false);
        };

        getWeather();
    }, [lat, lon]);

    const getMoonPhase = (phase) => {
        if (phase === 0) return "New Moon";
        if (phase > 0 && phase < 0.25) return "Waxing Crescent";
        if (phase === 0.25) return "First Quarter";
        if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
        if (phase === 0.5) return "Full Moon";
        if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
        if (phase === 0.75) return "Last Quarter";
        if (phase > 0.75 && phase <= 1) return "Waning Crescent";
        return "Unknown Phase";
    };

    if (error) return <p>Error: {error}</p>;

    return (
        
        <div /*style={{ position: "fixed", bottom: 0, width: "100%", backgroundColor: "#282c34", color: "white", padding: "10px", textAlign: "center" }}*/>
            {loading && <p>Loading...</p>}
            {weather && (
            <div>
                <h3>Weather in {decodeURIComponent(location)}</h3>
                {isLoaded && (
                        <GoogleMap mapContainerStyle={containerStyle} center={{ lat: parseFloat(lat), lng: parseFloat(lon) }} zoom={12}>
                            <Marker position={{ lat: parseFloat(lat), lng: parseFloat(lon) }} />
                        </GoogleMap>
                    )}
                <img src ={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="wthr img" />
                <p></p>
                <p>Temperature: {weather.main.temp}°</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind: {weather.wind.speed} mph</p>
                <p>Conditions: {weather.weather[0].description}</p>
                <p>Feels like: {weather.main.feels_like}°</p>
                <p>High: {weather.main.temp_max}°</p>
                <p>Low: {weather.main.temp_min}°</p>
                <p>Pressure: {weather.main.pressure} hPa</p>
                <p>Visibility: {weather.visibility} miles</p>
            </div>
        )}
            {astronomyData ? (
                <>
                    <p>Sunrise: {astronomyData.sunrise} | Sunset: {astronomyData.sunset} | Moon Phase: {getMoonPhase(astronomyData.moonphase)}</p>
                </>
            ) : (
                <p>Loading astronomy data...</p>
            )}
        </div>
    );
};

export default WeatherInfo;
