/* MOONPHASES
    0 – new moon
    0-0.25 – waxing crescent
    0.25 – first quarter
    0.25-0.5 – waxing gibbous
    0.5 – full moon
    0.5-0.75 – waning gibbous
    0.75 – last quarter
    0.75 -1 – waning crescent*/
import styles from './App.module.css';
import React, { useState } from "react";

const API_KEY = "DZQTE9HYT64JDRCBJBZR9DBJ9";

function AstronomyInfo() {
  const [location, setLocation] = useState("Location");
  const [date, setDate] = useState("YYYY-MM-DD");
  const [astronomyData, setAstronomyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getAstronomicalInfo() {
    if (!location || !date) {
      setError("Invalid location or date.");
      return;
    }

    setLoading(true);
    setError(null);

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}?key=${API_KEY}`;
  
    console.log("Fetching data from:", url);
  
    try {
      const response = await fetch(url);
      const text = await response.text(); 
      console.log("Raw API Response:", text);
    
      const data = JSON.parse(text);
      console.log("Parsed JSON Data:", data);
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${data.message || "Unknown error"}`);
      }
    
      if (!data.days || data.days.length === 0) {
        throw new Error("No astronomical data found for the given location and date.");
      }
    
      const { sunrise, sunset, moonphase } = data.days[0];
      setAstronomyData({ sunrise, sunset, moonphase });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getAstronomicalInfo();
  };


  let moonTerm = "Unknown Phase";
  if (astronomyData) {
    if (astronomyData.moonphase === 0) {
      moonTerm = "New Moon";
    } else if (astronomyData.moonphase > 0 && astronomyData.moonphase < 0.25) {
      moonTerm = "Waxing Crescent";
    } else if (astronomyData.moonphase === 0.25) {
      moonTerm = "First Quarter";
    } else if (astronomyData.moonphase > 0.25 && astronomyData.moonphase < 0.5) {
      moonTerm = "Waxing Gibbous";
    } else if (astronomyData.moonphase === 0.5) {
      moonTerm = "Full Moon";
    } else if (astronomyData.moonphase > 0.5 && astronomyData.moonphase < 0.75) {
      moonTerm = "Waning Gibbous";
    } else if (astronomyData.moonphase === 0.75) {
      moonTerm = "Last Quarter";
    } else if (astronomyData.moonphase > 0.75 && astronomyData.moonphase <= 1) {
      moonTerm = "Waning Crescent";
    }
  }


  return (
    <div className={styles.container}>
      <h2>Astronomical Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Location:
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </label>
        <label>
          Date:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">Get Info</button>
      </form>

      {loading && <p>Loading astronomical data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {astronomyData && (
        <div>
          <p>Sunrise: {astronomyData.sunrise}</p>
          <p>Sunset: {astronomyData.sunset}</p>
          <p>Moon Phase: {moonTerm}</p>
        </div>
      )}
    </div>
  );
}

export default AstronomyInfo;
