import './App.css';
import React, { useEffect, useState } from "react";

const API_KEY = "DZQTE9HYT64JDRCBJBZR9DBJ9";

function AstronomyInfo() {
  // Hardcoded location and date
  const location = "New York"; // Example: City name or coordinates
  const date = "2025-02-05";   // Format: YYYY-MM-DD

  const [astronomyData, setAstronomyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getAstronomicalInfo() {
      if (!location || !date) {
        setError("Invalid location or date.");
        setLoading(false);
        return;
      }

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
  
    getAstronomicalInfo();
  }, []);

  if (loading) return <p>Loading astronomical data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Astronomical Information for {location} on {date}</h2>
      <p>Sunrise: {astronomyData.sunrise}</p>
      <p>Sunset: {astronomyData.sunset}</p>
      <p>Moon Phase: {astronomyData.moonphase}</p>
    </div>
  );
}

export default AstronomyInfo;
