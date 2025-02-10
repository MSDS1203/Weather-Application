import './App.css';
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

  return (
    <div>
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
          <p>Moon Phase: {astronomyData.moonphase}</p>
        </div>
      )}
    </div>
  );
}

export default AstronomyInfo;
