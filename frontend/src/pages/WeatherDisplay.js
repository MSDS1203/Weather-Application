import React, { useState, useEffect, useRef } from "react";
import styles from "./WeatherDisplay.module.css";
import WeatherInfo from "../pages/weatherInfo"; // import correctly

const WeatherDisplay = ({ lat, lon, location }) => {
    const [weather, setWeather] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("hourly");
    

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
                const resHourly = await fetch(`/forecast/hourly?lat=${lat}&lon=${lon}&unit=imperial`);
                const resDaily = await fetch(`/forecast/daily?lat=${lat}&lon=${lon}&unit=imperial`);

                if (!response.ok || !resHourly.ok || !resDaily.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const data = await response.json();
                const dataHourly = await resHourly.json();
                const dataDaily = await resDaily.json();

                setWeather(data);
                setHourlyForecast(dataHourly.list.slice(0, 96));
                setDailyForecast(dataDaily.list.slice(0, 16));
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
            <div className={styles.container}>
                <h2>Weather in {weather.name}</h2>
                <p>Temperature: {weather.main.temp}°F</p>
                <p>Feels like: {weather.main.feels_like}°F</p>
                <p>Condition: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} mph</p>

                {/* Astronomy data at the bottom */}
                <WeatherInfo location={location} />
            </div>

            {/* Toggle buttons */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => setActiveTab("hourly")}
                    style={{ backgroundColor: activeTab === "hourly" ? "#4db8ff" : "#ddd" }}
                >
                    Hourly Forecast
                </button>
                <button
                    onClick={() => setActiveTab("daily")}
                    style={{ backgroundColor: activeTab === "daily" ? "#4db8ff" : "#ddd", marginLeft: "10px" }}
                >
                    Daily Forecast
                </button>
            </div>

            {/* Forecast Section */}
            {activeTab === "hourly" && (
                <div className={styles.scrollRow}>
                    {hourlyForecast.map((hour, index) => (
                        <div key={index} className={styles.forecastCard}>
                            <p>{hour.dt_txt}</p>
                            <img src={`http://openweathermap.org/img/w/${hour.weather[0].icon}.png`} alt="icon" />
                            <p>{hour.main.temp}°F</p>
                            <p>{hour.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "daily" && (
                <div className={styles.scrollRow}>
                    {dailyForecast.map((day, index) => (
                        <div key={index} className={styles.forecastCard}>
                            <p>{day.dt_txt || day.date}</p>
                            <img src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`} alt="icon" />
                            <p>High: {day.temp.max}°F</p>
                            <p>Low: {day.temp.min}°F</p>
                            <p>{day.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherDisplay;