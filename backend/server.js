// dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); 
const {searchCity, searchZip, getWeatherData} = require('./services/geoSearch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors());
app.use(express.json());

// get city recommendations based on search query (city name OR city-name,state-code,country-code)
// URL: http://localhost:3001/citySearch?q=QUERY (replace QUERY with search query)
// For calling from frontend, use fetch(`/citySearch?q=${query}`)
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
// URL: localhost:3001/zipSearch?q=QUERY (replace QUERY with zip and country code)
// For calling from frontend, use fetch(`/zipSearch?q=${query}`)
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
// URL: localhost:3001/weather?lat=LATITUDE&lon=LONGITUDE&unit=UNIT 
// (replace LATITUDE and LONGITUDE with coordinates, UNIT with imperial or metric)
// unit field is optional, default is imperial
// For calling from frontend, use fetch(`/weather?lat=${lat}&lon=${lon}`) 
app.get("/weather", async (req, res) => {
    const { lat, lon } = req.query;
    const unit = req.query.unit || 'imperial'; // if unit not in query, default to imperial

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
