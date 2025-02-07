// dependencies
const express = require('express');
const axios = require('axios');
require('dotenv').config(); 
const {searchCity, searchZip, getWeatherData} = require('./services/geoSearch');

const app = express();
const PORT = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// get city recommendations based on search query (city name OR city-name,state-code,country-code)
//URL: http://localhost:3000/citySearch?q=QUERY (replace QUERY with search query)
app.get('/citySearch', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing search query parameter' });

    try {
        const results = await searchCity(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get coordinates based on zip code and country code divided by comma 
// country code is optional, but recommended
// URL: localhost:3000/zipSearch?q=QUERY (replace QUERY with zip and country code)
app.get('/zipSearch', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing search query parameter' });

    try {
        const result = await searchZip(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get weather by coordinates
// URL: localhost:3000/weather?lat=LATITUDE&lon=LONGITUDE&unit=UNIT 
// (replace LATITUDE and LONGITUDE with coordinates, UNIT with imperial or metric)
app.get("/weather", async (req, res) => {
    // NEED TO SETUP A DEFAULT VALUE FOR UNIT (or just use api standard)
    const { lat, lon, unit } = req.query;

    // Validate input
    if (!lat || !lon || !unit) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const result = await getWeatherData(lat, lon, unit);
        res.json(result); // Return full API response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
