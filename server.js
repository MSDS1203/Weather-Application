// dependencies
const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
const PORT = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// get city recommendations based on search query (city name OR city-name,state-code,country-code)
//URL: http://localhost:3000/citySearch?q=QUERY (replace QUERY with search query)
app.get('/citySearch', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing search query parameter' });

    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: { 
                q: query, // user-provided search (city name, zip code, etc.)
                limit: 5, // limit to 5 recommendations
                appid: OPENWEATHER_API_KEY }
        });
        // format cities as: "city, state, country" (ex. "Greenville, North Carolina, US")
        const cities = response.data.map(city => `${city.name}, ${city.state}, ${city.country}`);
        res.json(cities);
    } catch (error) {
        console.error('Error fetching city data:', error);
        res.status(500).json({ error: 'Failed to fetch city data' });
    }
});

// get coordinates based on zip code and country code divided by comma 
// country code is optional, but recommended
// URL: localhost:3000/zipSearch?q=QUERY (replace QUERY with zip and country code)
app.get('/zipSearch', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing search query parameter' });

    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip`, {
            params: { 
                zip: query, // user-provided search (ex. "27858,US")
                //limit: 5, // limit to 5 recommendations
                appid: OPENWEATHER_API_KEY }
        });

        const { name, country, lat, lon } = response.data;

        // format response
        const formattedData = { 
            location: `${name}, ${country}`, 
            latitude: lat, 
            longitude: lon 
        };

        res.json(formattedData);

    } catch (error) {
        console.error('Error fetching zip code coordinates:', error);
        res.status(500).json({ error: 'Failed to fetch coordinates.' });
    }
});

// Route to get weather by coordinates
app.get("/weather", async (req, res) => {
    const { lat, lon } = req.query;

    // Validate input
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        // Fetch weather data from OpenWeatherMap
        const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: { lat, lon, appid: OWM_API_KEY, units: "imperial" }
        });

        res.json(response.data); // Return full API response
    } catch (error) {
        console.error("Error fetching weather data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
