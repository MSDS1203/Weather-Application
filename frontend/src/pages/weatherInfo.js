import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./weatherInfo.css";
import { getStoredUnitChoice, toggleUnitChoice } from "../utils.js";
import ForecastTabs from "../components/ForecastTabs";
import WeatherMap from "../components/WeatherMap";

const VC_API_KEY = process.env.REACT_APP_VISUAL_CROSSING_API_KEY;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const WeatherInfo = () => {
    const { location, lat, lon } = useParams();
    const [weather, setWeather] = useState(null);
    const [time, setTime] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [astronomyData, setAstronomyData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [buttonText, setButtonText] = useState('Save Location');
    const [error, setError] = useState(null);
    const [isMetric, setIsMetric] = useState(getStoredUnitChoice()); // load unit preference from localStorage
    const containerStyle = {
        width: "100%",
        height: "100%",
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

                const utcTimestamp = data.dt * 1000; 
                const timezoneOffsetMs = data.timezone * 1000; 
                const localTime = new Date(utcTimestamp + timezoneOffsetMs);

                const options = {
                timeZone: 'UTC', 
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
                };

                const splittingString = localTime.toLocaleString('en-US', options).split("at");
                splittingString[0] = splittingString[0].replace(/,/g, '');

                setWeather(data);
                setTime(splittingString[1].trim());
                setCurrentDate(splittingString[0].trim());
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
                const resHourly = await fetch(`/forecast?lat=${lat}&lon=${lon}`);
                const resDaily = await fetch(`/forecast?lat=${lat}&lon=${lon}`);

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
        <div>
            {loading && <p>Loading...</p>}
            {weather && (
                <div className={"weathCont"}>
                    <div style={{position: 'absolute', top: '110px', right: '150px', alignContent: 'center'}} className={"nameBox"}>{decodeURIComponent(location)}</div>
                    <div style={{position: 'absolute', top: '180px', right: '150px'}} className={"dtCont"}>
                        <div style={{float: 'left', alignContent: 'center'}} className={"dateTime"}>{ currentDate }</div>
                        <div style={{float: 'left', marginTop: '6px', alignContent: 'center'}} className={"dateTime"}>{ time }</div>
                    </div>

                    <Link to="/"><button style={{position: 'absolute', bottom: '5%', right: '5%'}} className={"button"}>SEARCH</button></Link>
                    <Link to="/saved"><button style={{position: 'absolute', bottom: '5%', right: '17.5%'}} className={"button"}>SAVED LOCATIONS</button></Link>
                    <button style={{position: 'absolute', bottom: '5%', right: '30%'}} className={"button"} onClick={saveLocation}>SAVE THIS LOCATION</button>
                    <button onClick={() => toggleUnitChoice(setIsMetric)} style={{position: 'absolute', bottom: '5%', right: '42.5%'}} className={"button"}>
                        {isMetric ? "SWITCH TO IMPERIAL" : "SWITCH TO METRIC"}
                    </button>
                    
                    {isLoaded && (
                        <div style={{position: 'absolute', top: '110px', left: '150px'}} className={"mapBox"}>
                            <WeatherMap lat={lat} lon={lon} />
                        </div>
                    )}

                    <div style={{position: 'absolute', top: '110px', left: '615px'}} className={"weathAl"}>
                        <p style={{fontFamily: "VT323", marginTop: '10px', fontSize: "40px", fontWeight: '500'}}>WEATHER ALERT</p>
                        <p style={{fontFamily: "Silkscreen", fontSize: "18px", fontWeight: '400', marginTop: '-30px'}}>
                            weather alert goes here, displays no notice if no alert text text text text
                        </p>
                    </div>

                    <div style={{position: 'absolute', top: '310px', left: '615px'}} className={"forecast"}>
                        <button className={"button"} style={{position: 'absolute', top: '-10px', right: '10px', width: '130px', backgroundColor: "#f1e5d4"}}>VIEW DAILY</button>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                        <div style={{float: 'left'}} className={"foreBox"}></div>
                    </div>

                    <img 
                        src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} 
                        alt="wthr img" 
                        style={{ position: 'absolute', top: '175px', right: '395px', width: "140px", height: "140px" }}
                    />
                    
                    <div style={{position: 'absolute', top: '30px', left: '150px'}} className={"condInfo"}><b>{weather.weather[0].description}</b></div>

                    <div style={{position: 'absolute', top: '640px', left: '615px'}} className={"weathInfo"}>
                        <b>Temperature:</b> {(isMetric ? (weather.main.temp - 32) * (5 / 9) : weather.main.temp).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>
                    <div style={{position: 'absolute', top: '700px', left: '615px'}} className={"weathInfo"}>
                        <b>Feels like:</b> {(isMetric ? (weather.main.feels_like - 32) * (5 / 9) : weather.main.feels_like).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>
                    <div style={{position: 'absolute', top: '760px', left: '615px'}} className={"weathInfo"}>
                        <b>High:</b> {(isMetric ? (weather.main.temp_max - 32) * (5 / 9) : weather.main.temp_max).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>
                    <div style={{position: 'absolute', top: '820px', left: '615px'}} className={"weathInfo"}>
                        <b>Low:</b> {(isMetric ? (weather.main.temp_min - 32) * (5 / 9) : weather.main.temp_min).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>

                    <div style={{position: 'absolute', top: '640px', left: '1000px'}} className={"weathInfo"}><b>Humidity:</b> {weather.main.humidity}%</div>
                    <div style={{position: 'absolute', top: '700px', left: '1000px'}} className={"weathInfo"}>
                        <b>Wind:</b> {(isMetric ? weather.wind.speed * 0.44704 : weather.wind.speed).toFixed(1)} {isMetric ? 'm/s' : 'mph'}
                    </div>
                    <div style={{position: 'absolute', top: '760px', left: '1000px'}} className={"weathInfo"}><b>Pressure:</b> {weather.main.pressure} hPa</div>
                    <div style={{position: 'absolute', top: '820px', left: '1000px'}} className={"weathInfo"}>
                        <b>Visibility:</b> {(isMetric ? weather.visibility * 0.621371 : weather.visibility).toFixed(1)} {isMetric ? 'kilometers' : 'miles'}
                    </div>
                </div>
            )}

            {astronomyData ? (
                <div className={"weathCont"}>
                    <div style={{position: 'absolute', top: '640px', right: '150px'}} className={"weathInfo"}><b>UV Index:</b> {astronomyData.uvIndex}</div>
                    <div style={{position: 'absolute', top: '700px', right: '150px'}} className={"weathInfo"}><b>Sunrise:</b> {astronomyData.sunrise}</div>
                    <div style={{position: 'absolute', top: '760px', right: '150px'}} className={"weathInfo"}><b>Sunset:</b> {astronomyData.sunset}</div>
                    <div style={{position: 'absolute', top: '820px', right: '150px'}} className={"weathInfo"}><b>Moon Phase:</b> {getMoonPhase(astronomyData.moonphase)}</div>
                </div>
            ) : (
                <p>Loading astronomy data...</p>
            )}
            
            <ForecastTabs hourlyForecast={hourlyForecast} dailyForecast={dailyForecast} />
        </div>

    );
};

export default WeatherInfo;
