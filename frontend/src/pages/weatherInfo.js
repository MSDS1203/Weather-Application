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
    const [viewMode, setViewMode] = useState("hourly"); // default to hourly view
    const [visibleIndex, setVisibleIndex] = useState(0); // default to first item in the list
    const batchSize = 7; // number of items to show at once
    const containerStyle = {
        width: "100%",
        height: "100%",
    };

    const handleNext = () => {
        if (viewMode === "hourly" && visibleIndex + batchSize < hourlyForecast.length) {
            setVisibleIndex(visibleIndex + batchSize);
        } else if (viewMode === "daily" && visibleIndex + batchSize < dailyForecast.length) {
            setVisibleIndex(visibleIndex + batchSize);
        }
    };

    const handlePrev = () => {
        if (visibleIndex - batchSize >= 0) {
            setVisibleIndex(visibleIndex - batchSize);
        }
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

                if (data) {
                    setButtonText('Un-save Location');
                } else {
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

                console.log("Daily Data:", dailyData);
                console.log("Daily Data List to get:", dailyData.list.slice(0, 16));

                const listOfDays = dailyData.list.slice(0, 16);
                for (let i = 0; i < listOfDays.length; i++) {
                    const utcTimestamp = listOfDays[i].dt * 1000;
                    const timezoneOffsetMs = dailyData.city.timezone * 1000;
                    const localTime = new Date(utcTimestamp + timezoneOffsetMs);

                    listOfDays[i].dt_txt = localTime.toLocaleDateString('en-US', {
                        timeZone: 'UTC',
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });

                    console.log(listOfDays[i].dt_txt);

                    listOfDays[i].dt_txt = listOfDays[i].dt_txt.split(" at ")[0].trim();

                    console.log("Local Time:", listOfDays[i]);

                }

                const listOfHours = hourlyData.list.slice(0, 96);
                for (let i = 0; i < listOfHours.length; i++) {
                    const utcTimestamp = listOfHours[i].dt * 1000;
                    const timezoneOffsetMs = hourlyData.city.timezone * 1000;
                    const localTime = new Date(utcTimestamp + timezoneOffsetMs);
                    const options = {
                        timeZone: 'UTC',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    };

                    const splittingString = localTime.toLocaleString('en-US', options).split("at");
                    splittingString[0] = splittingString[0].replace(/,/g, '');

                    const fullTime = localTime.toLocaleString('en-US', options);
                    listOfHours[i].dt_txt = fullTime;

                }

                setHourlyForecast(hourlyData.list.slice(0, 96));
                setDailyForecast(dailyData.list.slice(0, 16));
            } catch (err) {
                setError(err.message);
            }
        };

        fetchForecasts();
    }, [lat, lon]);

    useEffect(() => {
        const updateClock = (offset) => {
            const now = new Date();
            const localTime = new Date(now.getTime() + offset);
            const options = {
                timeZone: 'UTC',
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };
            const parts = localTime.toLocaleString('en-US', options).split(' at ');
            const [date, time] = parts.length === 2
                ? [parts[0].replace(/,/g, ''), parts[1]]
                : [now.toLocaleDateString('en-US'), now.toLocaleTimeString('en-US')];

            setCurrentDate(date);
            setTime(time);
        };

        let intervalId;

        const intializeClock = async () => {
            try {
                const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
                if (!response.ok) throw new Error("Failed to fetch weather data");
    
                const data = await response.json();
                const timezoneOffsetMs = data.timezone * 1000;
    
                updateClock(timezoneOffsetMs); // Initial run
                intervalId = setInterval(() => updateClock(timezoneOffsetMs), 1000); // Update every second
            } catch (err) {
                console.error("Error initializing clock:", err);
                setError(err.message);
            }
        };

        intializeClock();

        return () => clearInterval(intervalId); // cleanup
    }, []);


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
        try {
            if (buttonText === 'Save Location') {
                // Save the location
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
            } else {
                // Un-save the location
                const response = await fetch(`/delete-location/${encodeURIComponent(location)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete location');
                }

                setButtonText('Save Location');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to ${buttonText === 'Save Location' ? 'save' : 'delete'} location`);
        }
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {loading && <p>Loading...</p>}
            {weather && (
                <div className={"weathCont"}>
                    <div style={{ position: 'absolute', top: '110px', right: '150px', alignContent: 'center' }} className={"nameBox"}>{decodeURIComponent(location)}</div>
                    <div style={{ position: 'absolute', top: '180px', right: '150px' }} className={"dtCont"}>
                        <div style={{ float: 'left', alignContent: 'center' }} className={"dateTime"}>{currentDate}</div>
                        <div style={{ float: 'left', marginTop: '6px', alignContent: 'center' }} className={"dateTime"}>{time}</div>
                    </div>

                    <Link to="/"><button style={{ position: 'absolute', bottom: '5%', right: '5%' }} className={"button"}>SEARCH</button></Link>
                    <Link to="/saved"><button style={{ position: 'absolute', bottom: '5%', right: '17.5%' }} className={"button"}>SAVED LOCATIONS</button></Link>
                    <button style={{ position: 'absolute', bottom: '5%', right: '30%' }} className={"button"} onClick={saveLocation}>{buttonText}</button>
                    <button onClick={() => toggleUnitChoice(setIsMetric)} style={{ position: 'absolute', bottom: '5%', right: '42.5%' }} className={"button"}>
                        {isMetric ? "SWITCH TO IMPERIAL" : "SWITCH TO METRIC"}
                    </button>

                    {isLoaded && (
                        <div style={{ position: 'absolute', top: '110px', left: '150px' }} className={"mapBox"}>
                            <WeatherMap lat={lat} lon={lon} />
                        </div>
                    )}

                    <div style={{ position: 'absolute', top: '110px', left: '615px' }} className={"weathAl"}>
                        <p style={{ fontFamily: "VT323", marginTop: '30px', fontSize: "100px", fontWeight: '500' }}>WEATHER VALLEY</p>
                    </div>

                    <div
                        style={{ position: 'absolute', top: '310px', left: '615px' }}
                        className="forecast"
                    >
                        <button
                            className="button"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '130px',
                                backgroundColor: '#f1e5d4',
                            }}
                            onClick={() => {
                                setViewMode(viewMode === 'hourly' ? 'daily' : 'hourly');
                                setVisibleIndex(0);
                            }}
                        >
                            VIEW {viewMode === 'hourly' ? 'DAILY' : 'HOURLY'}
                        </button>

                        {(viewMode === 'hourly' ? hourlyForecast : dailyForecast)
                            .slice(visibleIndex, visibleIndex + batchSize)
                            .map((item, index) => (
                                <div key={index} className="foreBox">
                                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                        {item.dt_txt}
                                    </p>
                                    <img
                                        src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                                        alt="icon"
                                    />
                                    <p>
                                    </p>
                                    {viewMode === 'hourly' ? (
                                        <p>{(isMetric ? (item.main.temp - 32) * (5 / 9) : item.main.temp).toFixed(0)}°{isMetric ? 'C' : 'F'}</p>
                                    ) : (
                                        <>
                                            <p>{(isMetric ? (item.temp.min - 32) * (5 / 9) : item.temp.min).toFixed(0)}°{isMetric ? 'C' : 'F'} / {(isMetric ? (item.temp.max - 32) * (5 / 9) : item.temp.max).toFixed(0)}°{isMetric ? 'C' : 'F'}</p>
                                        </>
                                    )}

                                    <p>{item.weather[0].main}</p>
                                </div>
                            ))}
                    </div>

                    <img
                        src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                        alt="wthr img"
                        style={{ position: 'absolute', top: '175px', right: '395px', width: "140px", height: "140px" }}
                    />

                    <div style={{ position: 'absolute', top: '30px', left: '150px' }} className={"condInfo"}><b>{weather.weather[0].description}</b></div>

                    <div style={{ position: 'absolute', top: '640px', left: '615px' }} className={"weathInfo"}>
                        <b>Temperature:</b> {(isMetric ? (weather.main.temp - 32) * (5 / 9) : weather.main.temp).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>
                    <div style={{ position: 'absolute', top: '700px', left: '615px' }} className={"weathInfo"}>
                        <b>Feels like:</b> {(isMetric ? (weather.main.feels_like - 32) * (5 / 9) : weather.main.feels_like).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>
                    <div style={{ position: 'absolute', top: '760px', left: '615px' }} className={"weathInfo"}>
                        <b>High:</b> {(isMetric ? (weather.main.temp_max - 32) * (5 / 9) : weather.main.temp_max).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>
                    <div style={{ position: 'absolute', top: '820px', left: '615px' }} className={"weathInfo"}>
                        <b>Low:</b> {(isMetric ? (weather.main.temp_min - 32) * (5 / 9) : weather.main.temp_min).toFixed(1)}°{isMetric ? 'C' : 'F'}
                    </div>

                    <div style={{ position: 'absolute', top: '640px', left: '1000px' }} className={"weathInfo"}><b>Humidity:</b> {weather.main.humidity}%</div>
                    <div style={{ position: 'absolute', top: '700px', left: '1000px' }} className={"weathInfo"}>
                        <b>Wind:</b> {(isMetric ? weather.wind.speed * 0.44704 : weather.wind.speed).toFixed(1)} {isMetric ? 'm/s' : 'mph'}
                    </div>
                    <div style={{ position: 'absolute', top: '760px', left: '1000px' }} className={"weathInfo"}><b>Pressure:</b> {weather.main.pressure} hPa</div>
                    <div style={{ position: 'absolute', top: '820px', left: '1000px' }} className={"weathInfo"}>
                        <b>Visibility:</b> {(isMetric ? weather.visibility * 0.621371 : weather.visibility).toFixed(1)} {isMetric ? 'kilometers' : 'miles'}
                    </div>
                </div>
            )}

            {astronomyData ? (
                <div className={"weathCont"}>
                    <div style={{ position: 'absolute', top: '640px', right: '150px' }} className={"weathInfo"}><b>UV Index:</b> {astronomyData.uvIndex}</div>
                    <div style={{ position: 'absolute', top: '700px', right: '150px' }} className={"weathInfo"}><b>Sunrise:</b> {astronomyData.sunrise}</div>
                    <div style={{ position: 'absolute', top: '760px', right: '150px' }} className={"weathInfo"}><b>Sunset:</b> {astronomyData.sunset}</div>
                    <div style={{ position: 'absolute', top: '820px', right: '150px' }} className={"weathInfo"}><b>Moon Phase:</b> {getMoonPhase(astronomyData.moonphase)}</div>
                </div>
            ) : (
                <p>Loading astronomy data...</p>
            )}

            <ForecastTabs hourlyForecast={hourlyForecast} dailyForecast={dailyForecast} />
        </div>

    );
};

export default WeatherInfo;
