// dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { searchCity, searchZip, getWeatherData, saveGeolocation, getAstronomyData, getAllGeolocations, getGeolocation, deleteGeolocation } = require('./services/geoSearch');
const { getCachedWeather, saveWeatherToCache, getCachedForecast, saveForecastToCache, getCachedAstronomy, saveAstronomyToCache} = require('./services/cache');
const { getHourlyForecast, getDailyForecast} = require('./services/geoSearch');
const e = require('express');


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

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

// get location name based on coordinates
// URL: localhost:3001/geocode/reverse?lat=LATITUDE&lon=LONGITUDE
// For calling from frontend, use fetch(`/geocode/reverse?lat=${lat}&lon=${lon}`)
app.get('/geocode/reverse', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) return res.status(400).json({ error: 'Missing latitude and/or longitude parameters' });

    try {
        const result = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
            params: {
                lat,
                lon,
                limit: 1,
                appid: OPENWEATHER_API_KEY
            }
        });
        const {name, state, country} = result.data[0];
        res.json({ name, state, country });
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
        // Check SQLite Cache First
        const cachedWeather = await getCachedWeather(lat, lon);
        if (cachedWeather) {
            console.log("Serving weather data from cache");
            return res.json(cachedWeather);
        }

        console.log("Fetching new weather data from OpenWeatherMap API...");
        const result = await getWeatherData(lat, lon, unit);

        // Save to cache
        await saveWeatherToCache(lat, lon, result);
        res.json(result);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Failed to retrieve weather data" });
    }
});
// Route to get hourly forecast
// URL: localhost:3001/forecast/hourly?lat=LATITUDE&lon=LONGITUDE
app.get("/forecast/hourly", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Latitude and Longitude are required" });

    try {
        // Check cache first
        const cachedForecast = await getCachedForecast(lat, lon, "hourly");
        if (cachedForecast) return res.json(cachedForecast);

        // Fetch new data from API
        const forecast = await getHourlyForecast(lat, lon);
        await saveForecastToCache(lat, lon, "hourly", forecast);
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get daily forecast
// URL: localhost:3001/forecast/daily?lat=LATITUDE&lon=LONGITUDE&appid=API_KEY
app.get("/forecast/daily", async (req, res) => {
    
    const { lat, lon, unit = "imperial"} = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Latitude and Longitude are required" });

    try {
        // Check cache first
        const cachedForecast = await getCachedForecast(lat, lon, "daily");
        if (cachedForecast) return res.json(cachedForecast);

        // Fetch new data from API
        const forecast = await getDailyForecast(lat, lon, unit);
        await saveForecastToCache(lat, lon, "daily", forecast);
        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to save geolocation
app.use(express.json());
app.post('/save-location', async (req, res) => {
    const { location, lat, lon } = req.body;
    try {
        saveGeolocation(location, lat, lon);
        res.status(200).send('Location saved successfully');
    } catch (error) {
        res.status(500).send('Error saving location');
    }
});

// Route to delete a saved location
app.delete('/delete-location/:location', async (req, res) => {
    const location = req.params.location;
    console.log("Received delete request for:", location);

    if (!location) {
        return res.status(400).json({ error: 'Location name is required' });
    }

    try {
        const deleted = await deleteGeolocation(location);
        if (deleted) {
            console.log(`Successfully deleted: ${location}`);
            res.status(200).send('Location deleted successfully');
        } else {
            console.warn(`Location not found in DB: ${location}`);
            res.status(404).send('Location not found');
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error.message });
    }
    
});

// Route to get all saved geolocations
app.get('/saved-locations', async (req, res) => {
    try {
        const locations = await getAllGeolocations();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Route to check if a location is saved
app.get('/is-saved', async (req, res) => {
    const { location } = req.query;
    try {
        const savedLocation = await getGeolocation(location);
        if (savedLocation) {
            res.json(true);
        } else {
            res.json(false);
        }
    } catch (error) {
        res.status(500).send('Error checking location');
    }
});

// Route to get astronomy data by location
// URL: localhost:3001/astronomy?location=LOCATION
app.get("/astronomy", async (req, res) => {
    const { location } = req.query;
    if (!location) return res.status(400).json({ error: "Location is required" });

    try {
        // Check SQLite Cache First
        console.log(`Checking cache for astronomy data for location: ${location}`);
        const cachedAstronomy = await getCachedAstronomy(location);
        if (cachedAstronomy) {
            console.log("Serving astronomy data from cache");
            return res.json(cachedAstronomy);
        }

        console.log(`Fetching astronomy data from API for location: ${location}`);
        const astronomyData = await getAstronomyData(location);

        console.log(`Saving fetched astronomy data to cache for location: ${location}`);
        await saveAstronomyToCache(location, astronomyData);
        res.json(astronomyData);
    } catch (error) {
        console.error("Error fetching astronomy data:", error);
        res.status(500).json({ error: "Failed to retrieve astronomy data" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
