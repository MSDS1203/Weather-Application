import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./weatherInfo.css"; 
import { getStoredUnitChoice, toggleUnitChoice } from "../utils.js";

const VC_API_KEY = process.env.REACT_APP_VISUAL_CROSSING_API_KEY;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const WeatherInfo = () => {
    const { location, lat, lon } = useParams();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [astronomyData, setAstronomyData] = useState(null);
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
                setWeather(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
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
                        <div style={{float: 'left', alignContent: 'center'}} className={"dateTime"}>JAN - WED 22</div>
                        <div style={{float: 'left', marginTop: '6px', alignContent: 'center'}} className={"dateTime"}>12:00 PM</div>
                    </div>

                    <Link to="/"><button style={{position: 'absolute', bottom: '5%', right: '5%'}} className={"button"}>SEARCH</button></Link>
                    <Link to="/saved"><button style={{position: 'absolute', bottom: '5%', right: '17.5%'}} className={"button"}>SAVED LOCATIONS</button></Link>
                    <button style={{position: 'absolute', bottom: '5%', right: '30%'}} className={"button"} onClick={saveLocation}>SAVE THIS LOCATION</button>
                    
                    {isLoaded && (
                        <div style={{position: 'absolute', top: '110px', left: '150px'}} className={"mapBox"}>
                            <GoogleMap 
                                mapContainerStyle={containerStyle} 
                                center={{ lat: parseFloat(lat), lng: parseFloat(lon) }} 
                                zoom={12}
                            >
                                <Marker position={{ lat: parseFloat(lat), lng: parseFloat(lon) }} />
                            </GoogleMap>
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

                    <div style={{position: 'absolute', top: '640px', left: '615px'}} className={"weathInfo"}><b>Temperature:</b> {weather.main.temp}°</div>
                    <div style={{position: 'absolute', top: '700px', left: '615px'}} className={"weathInfo"}><b>Feels like:</b> {weather.main.feels_like}°</div>
                    <div style={{position: 'absolute', top: '760px', left: '615px'}} className={"weathInfo"}><b>High:</b> {weather.main.temp_max}°</div>
                    <div style={{position: 'absolute', top: '820px', left: '615px'}} className={"weathInfo"}><b>Low:</b> {weather.main.temp_min}°</div>

                    <div style={{position: 'absolute', top: '640px', left: '1000px'}} className={"weathInfo"}><b>Humidity:</b> {weather.main.humidity}%</div>
                    <div style={{position: 'absolute', top: '700px', left: '1000px'}} className={"weathInfo"}><b>Wind:</b> {weather.wind.speed} mph</div>
                    <div style={{position: 'absolute', top: '760px', left: '1000px'}} className={"weathInfo"}><b>Pressure:</b> {weather.main.pressure} hPa</div>
                    <div style={{position: 'absolute', top: '820px', left: '1000px'}} className={"weathInfo"}><b>Visibility:</b> {weather.visibility} miles</div>
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
        </div>

    );
};

export default WeatherInfo;
