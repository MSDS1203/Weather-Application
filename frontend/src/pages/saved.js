import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, data, Link } from 'react-router-dom';
import WeatherDisplay from "../components/WeatherDisplay";
import './saved.css';
import image from './wi-day-sunny.svg';
import { getStoredUnitChoice, toggleUnitChoice } from "../utils.js";

const Saved = () => {
    // Convert locations to a state variable
    const [locations, setLocations] = useState({});
    const [lowOb, setLowOb] = useState(0);
    const [highOb, setHighOb] = useState(3);

    // Load unit preference from localStorage
    const [isMetric, setIsMetric] = useState(getStoredUnitChoice());

    // Fetch saved locations from the server when the component mounts
    useEffect(() => {
        const fetchSavedLocations = async () => {
            try {
                console.log("Fetching saved locations...");
                const response = await axios.get("/saved-locations");
                console.log("Response from server:", response.data);
                const savedLocations = response.data.reduce((acc, loc) => {
                    acc[loc.location] = {
                        location: loc.location,
                        latitude: loc.lat,
                        longitude: loc.lon,
                    };
                    return acc;
                    
                }, {});
                console.log("Saved locations:", savedLocations);
                setLocations(savedLocations);
            } catch (error) {
                console.error("Error fetching saved locations:", error);
            }
        };
        fetchSavedLocations();
    }, []);

    const unsaveLocation = async (key) => {
        try {
            const response = await axios.delete(`/delete-location/${encodeURIComponent(key)}`);
            
            if (response.status === 200) {
                console.log("Successfully deleted:", key);
    
                setLocations(prevLocations => {
                    const updatedLocations = { ...prevLocations };
                    delete updatedLocations[key];
                    return updatedLocations;
                });
            } else {
                console.warn("Deletion failed:", response.data);
            }
        } catch (error) {
            console.error("Error unsaving location:", error);
        }
    };
    
    const handlePrev = () => {
        setLowOb(lowOb-3);
        setHighOb(highOb-3);
    }

    const handleNext = () => {
        setLowOb(lowOb+3);
        setHighOb(highOb+3);
    }

    const navigate = useNavigate();

    return (
        <div>
            <Link to="/"><button style={{position: 'absolute', top: '5%', right: '5%'}} className={"button"}>BACK</button></Link>
            <button onClick={() => toggleUnitChoice(setIsMetric)} style={{position: 'absolute', top: '5%', right: '20%'}} className={"button"}>{isMetric ? "SWITCH TO IMPERIAL" : "SWITCH TO METRIC"}</button>
            
            <div className={"savedCont"}>
                <button onClick = {handlePrev} className={'nextButton'} disabled = {lowOb === 0} style = {{position: 'absolute', left: '1%'}}>PREV</button>
                <button onClick = {handleNext} className={'nextButton'} disabled = {highOb >= Object.keys(locations).length} style = {{position: 'absolute', right: '5%'}}>NEXT</button>

                {Object.entries(locations).slice(lowOb, highOb).map(([location, values]) => (
                    <button key={location} className = {"savedLoc"} onClick={() => {navigate(`/weather/${encodeURIComponent(values.location)}/${values.latitude}/${values.longitude}`)}}>
                        <p style={{fontFamily: "VT323", fontSize: "28px", fontWeight: '500', marginTop: '60px', marginBottom: '-15px'}}><b>{values.location}</b></p>
                        <WeatherDisplay lat={values.latitude} lon={values.longitude} isMetric={isMetric} />
                        <button onClick={(event) => { event.stopPropagation(); unsaveLocation(location); }} style= {{position: "relative", top: "-560px", left: "-200px"}} className={"removeLoc"}>X</button>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Saved;