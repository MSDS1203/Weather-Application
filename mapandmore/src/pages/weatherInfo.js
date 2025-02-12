import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WeatherInfo = () => {
    const { location, lat, lon } = useParams();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch weather data
        const getWeather = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/weather?lat=${lat}&lon=${lon}&unit=imperial`);
                setWeather(response.data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
            setLoading(false);
        };

        getWeather();
    }, [lat, lon]);

    return(
        <div>
            {loading && <p>Loading...</p>}
            {weather && (
                <div>
                    <h3>Weather in {decodeURIComponent(location)}</h3>
                    <p></p>
                    <p>Temperature: {weather.main.temp}°</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                    {/*Put other information here! */}
                </div>
            )}
        </div>
    );
}

export default WeatherInfo;