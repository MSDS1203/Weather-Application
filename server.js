// dependencies
const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
const PORT = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// get city recommendations based on search query
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing search query parameter' });

    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: { 
                q: query, // user-provided search (city name, zip code, etc.)
                limit: 5, // limit to 5 recommendations
                appid: OPENWEATHER_API_KEY }
        });
        // format cities as: "city, country" (ex. "New York, US")
        const cities = response.data.map(city => `${city.name}, ${city.state}, ${city.country}`);
        res.json(cities);
    } catch (error) {
        console.error('Error fetching city data:', error);
        res.status(500).json({ error: 'Failed to fetch city data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));