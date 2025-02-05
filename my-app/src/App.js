import './App.css';
import React, { useEffect, useState } from "react";

const API_KEY = "DZQTE9HYT64JDRCBJBZR9DBJ9"; // Replace with your actual API key

function AstronomyInfo({ location, date }) {
  const [astronomyData, setAstronomyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getAstronomicalInfo() {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}?key=${API_KEY}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Extract relevant astronomical info
        const { sunrise, sunset, moonphase } = data.days[0];

        setAstronomyData({ sunrise, sunset, moonphase });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getAstronomicalInfo();
  }, [location, date]);

  if (loading) return <p>Loading astronomical data...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("Astronomical Information for ",  location, " on ", date)
  console.log("Sunrise: ", astronomyData.sunrise)
  console.log("Sunset: ", astronomyData.sunset)
  console.log("Moon Phase: ", astronomyData.moonphase)

}

export default App;
