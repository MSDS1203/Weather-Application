const axios = require('axios');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const db = require('./sqliteDB');

// get city recommendations based on search query
async function searchCity(query) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q: query, // user-provided search (city name, zip code, etc.)
                limit: 5, // limit to 5 recommendations
                appid: OPENWEATHER_API_KEY
            }
        });
        // format cities as: "city, state, country" (ex. "Greenville, North Carolina, US")
        const cities = response.data.map(city => ({
            location: [city.name, city.state, city.country].filter(Boolean).join(', '), // filter out empty state values
            latitude: city.lat,
            longitude: city.lon
        }));

        // Store each result in SQLite
        for (const city of cities) {
            await saveGeolocation(city.location, city.latitude, city.longitude);
        }

        return cities;

    } catch (error) {
        console.error('Error fetching city data:', error);
        throw new Error('Failed to fetch city data');
    }
}

// get coordinates based on zip code and country code
async function searchZip(query) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip`, {
            params: {
                zip: query,
                appid: OPENWEATHER_API_KEY
            }
        });

        const { name, country, lat, lon } = response.data;

        // format response
        const locationData = {
            location: `${name}, ${country}`,
            latitude: lat,
            longitude: lon
        };

        // Store the geolocation in SQLite
        await saveGeolocation(locationData.location, locationData.latitude, locationData.longitude);

        return locationData;
    } catch (error) {
        console.error("Error fetching zip code coordinates:", error);
        throw new Error("Failed to fetch coordinates.");
    }
}

// get weather data based on latitude and longitude
async function getWeatherData(lat, lon, unit) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat,
                lon,
                appid: OPENWEATHER_API_KEY,
                units: unit
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
}

// Get Hourly Forecast for up to the next 4 days
async function getHourlyForecast(lat, lon, unit = 'imperial', cnt = 96) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast/hourly`, {
            params: {
                lat,
                lon,
                appid: OPENWEATHER_API_KEY,
                unit,
                cnt: 96 // Can be changed to a number between 24 (1 day) up to 96 (4 days)
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching hourly forecast:', error);
        throw new Error('Failed to fetch hourly forecast');
    }
}

// Get Daily Forecast for up to the next 16 days
async function getDailyForecast(lat, lon, cnt, unit) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast/daily`, {
            params: {
                lat,
                lon,
                appid: OPENWEATHER_API_KEY,
                units: unit,
                cnt: 16 // Number of days. Can be changed to a number bewteen 1 and 16
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching daily forecast:', error);
        throw new Error('Failed to fetch daily forecast');
    }
}

// Function to save geolocation data in SQLite
function saveGeolocation(location, lat, lon) {
    return new Promise((resolve, reject) => {
        db.run("INSERT OR REPLACE INTO geolocation (location, lat, lon) VALUES (?, ?, ?)",
            [location, lat, lon],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

// Function to retrieve stored geolocation data
function getGeolocation(location) {
    return new Promise((resolve, reject) => {
        db.get("SELECT lat, lon FROM geolocation WHERE location = ?", [location], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Function to delete stored geolocation data
function deleteGeolocation(location) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM geolocation WHERE location = ?", [location], function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
}

module.exports = { searchCity, searchZip, getWeatherData, getHourlyForecast, getDailyForecast, getGeolocation, deleteGeolocation };