const axios = require('axios');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// get city recommendations based on search query
async function searchCity(query) {
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: { 
                q: query, // user-provided search (city name, zip code, etc.)
                limit: 5, // limit to 5 recommendations
                appid: OPENWEATHER_API_KEY }
        });
        // format cities as: "city, state, country" (ex. "Greenville, North Carolina, US")
        return response.data.map(city => ({
            location: [city.name, city.state, city.country].filter(Boolean).join(', '), // filter out empty state values
            latitude: city.lat,
            longitude: city.lon
        }));    
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
                zip: query, // user-provided search (ex. "27858,US")
                appid: OPENWEATHER_API_KEY }
        });

        const { name, country, lat, lon } = response.data;

        // format response
        return { 
            location: `${name}, ${country}`, 
            latitude: lat, 
            longitude: lon 
        };
    } catch (error) {
        console.error('Error fetching zip code coordinates:', error);
        throw new Error('Failed to fetch coordinates.');
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
                units: unit }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
}

module.exports = { searchCity, searchZip, getWeatherData };