import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from "./WeatherDisplay.module.css";
import { getStoredUnitChoice, toggleUnitChoice } from "../utils.js";
import ForecastTabs from "../components/ForecastTabs";

const VC_API_KEY = process.env.REACT_APP_VISUAL_CROSSING_API_KEY;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const WeatherInfo = () => {
    const { location, lat, lon } = useParams();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [astronomyData, setAstronomyData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [buttonText, setButtonText] = useState('Save Location');
    const [error, setError] = useState(null);
    const [isMetric, setIsMetric] = useState(getStoredUnitChoice()); // load unit preference from localStorage
    const containerStyle = {
        width: "60%",
        height: "400px",
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
    });

    // Check if the location is currently saved
    useEffect(() => {
        const checkLocation = async () => {
            try {
                const response = await fetch(`/is-saved?location=${location}`);
                const data = await response.json();

                if (data){
                    setButtonText('Un-save Location');
                } else{
                    setButtonText('Save Location');
                }

            } catch (err) {
                console.error("Error checking location:", err);
            }
        };
        checkLocation();
    }, [location]);

    useEffect(() => {
        const fetchAstronomyData = async () => {
            try {
                const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?key=${VC_API_KEY}`);
                const data = await response.json();

                if (!data.days || data.days.length === 0) {
                    throw new Error("No astronomical data found.");
                }

                const { sunrise, sunset, moonphase } = data.days[0];
                const uvIndex = data.currentConditions.uvindex;
                setAstronomyData({ sunrise, sunset, moonphase, uvIndex });
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

        getWeather();
    }, [lat, lon]);

    useEffect(() => {
        const fetchForecasts = async () => {
            try {
                const resHourly = await fetch(`/forecast/hourly?lat=${lat}&lon=${lon}`);
                const resDaily = await fetch(`/forecast/daily?lat=${lat}&lon=${lon}`);

                if (!resHourly.ok || !resDaily.ok) throw new Error("Failed to fetch forecast data");

                const hourlyData = await resHourly.json();
                const dailyData = await resDaily.json();

                setHourlyForecast(hourlyData.list.slice(0, 96));
                setDailyForecast(dailyData.list.slice(0, 16));
            } catch (err) {
                setError(err.message);
            }
        };

        fetchForecasts();
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
        
    const saveLocation = async () => {
        if(buttonText === 'Save Location') {
            setButtonText('Un-save Location');

            try {
                const response = await fetch('/save-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        location: decodeURIComponent(location),
                        lat,
                        lon
                    }),
                });
        
                if (!response.ok) {
                    throw new Error('Failed to save location');
                }

                setButtonText('Un-save Location');
                alert('Location saved successfully');
                
            } catch (error) {
                console.error('Error saving location:', error);
                alert('Failed to save location');
            }
        } else {
            try{
                const response = await fetch(`/delete-location/${encodeURIComponent(location)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to delete location');
                }
                alert('Location deleted successfully');

            } catch (error) {
                console.error('Error deleting location:', error);
                alert('Failed to delete location');
            }
            setButtonText('Save Location');
        }
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            {loading && <p>Loading...</p>}
            {weather && (
                <div>
                    <h3>Weather in {decodeURIComponent(location)}</h3>
                    <button onClick={saveLocation}>Save Location</button>

                    {isLoaded && (
                        <div className={styles.mapContainer}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={{ lat: parseFloat(lat), lng: parseFloat(lon) }}
                                zoom={12}
                            >
                                <Marker position={{ lat: parseFloat(lat), lng: parseFloat(lon) }} />
                            </GoogleMap>
                        </div>
                    )}

                    <img
                        src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                        alt="wthr img"
                        style={{ width: "100px", height: "100px" }}
                    />
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
                <div>
                    <p>UV Index: {astronomyData.uvIndex}</p>
                    <p>Sunrise: {astronomyData.sunrise} | Sunset: {astronomyData.sunset} | Moon Phase: {getMoonPhase(astronomyData.moonphase)}</p>
                </div>
            ) : (
                <p>Loading astronomy data...</p>
            )}
            
            <ForecastTabs hourlyForecast={hourlyForecast} dailyForecast={dailyForecast} />
        </div>

    );
};

export default WeatherInfo;
