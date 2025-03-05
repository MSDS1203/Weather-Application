const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Ensure database folder exists
const dbFolderPath = path.resolve(__dirname, "../database");
const dbFilePath = path.join(dbFolderPath, "weather_app.db");

// If the folder doesn't exist, create it
if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath, { recursive: true });
}

// Initialize SQLite database
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error("SQLite Error: Cannot open database", err);
    } else {
        console.log("Connected to SQLite database for caching");
    }
});

// Function to get cached weather data
function getCachedWeather(lat, lon) {
    return new Promise((resolve, reject) => {
        db.get("SELECT data, timestamp FROM weather_cache WHERE location = ?", [`${lat},${lon}`], (err, row) => {
            if (err) reject(err);
            else if (row && Date.now() - row.timestamp < 60 * 60 * 1000) {
                console.log("Serving weather data from SQLite cache");
                resolve(JSON.parse(row.data));
            } else {
                resolve(null);
            }
        });
    });
}

// Function to save weather data to cache
function saveWeatherToCache(lat, lon, data) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT OR REPLACE INTO weather_cache (location, data, timestamp) VALUES (?, ?, ?)",
            [`${lat},${lon}`, JSON.stringify(data), Date.now()],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

// Get cached weather forecast (hourly/daily)
function getCachedForecast(lat, lon, type) {
    return new Promise((resolve, reject) => {
        db.get("SELECT data, timestamp FROM forecast_cache WHERE location = ? AND type = ?",
            [`${lat},${lon}`, type],
            (err, row) => {
                if (err) reject(err);
                else if (row && Date.now() - row.timestamp < 3 * 60 * 60 * 1000) { // 3-hour expiration
                    console.log(`Serving ${type} forecast from SQLite cache`);
                    resolve(JSON.parse(row.data));
                } else {
                    resolve(null);
                }
            });
    });
}

// Save weather forecast (hourly/daily) to cache
function saveForecastToCache(lat, lon, type, data) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT OR REPLACE INTO forecast_cache (location, type, data, timestamp) VALUES (?, ?, ?, ?)",
            [`${lat},${lon}`, type, JSON.stringify(data), Date.now()],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

function getCachedAstronomy(location) {
    return new Promise((resolve, reject) => {
        console.log(`Querying astronomy cache for location: ${location}`);
        db.get("SELECT data, timestamp FROM astronomy_cache WHERE location = ?", [location], (err, row) => {
            if (err) {
                console.error("Error in getCachedAstronomy:", err);
                reject(err);
            } else if (row) {
                console.log("Row found in astronomy_cache:", row); // Debugging
                const currentTime = Date.now();
                const cacheAge = currentTime - row.timestamp;
                console.log(`Cache age: ${cacheAge} ms`);
                if (cacheAge < 24 * 60 * 60 * 1000) {
                    console.log("Serving astronomy data from SQLite cache");
                    resolve(JSON.parse(row.data));
                } else {
                    console.log("Astronomy cache expired, serving fresh data");
                    resolve(null);
                }
            } else {
                console.log("No astronomy data found in cache");
                resolve(null);
            }
        });
    });
}

function saveAstronomyToCache(location, data) {
    return new Promise((resolve, reject) => {
        console.log(`Saving astronomy data for location: ${location}`); // Debugging
        db.run(
            "INSERT OR REPLACE INTO astronomy_cache (location, data, timestamp) VALUES (?, ?, ?)",
            [location, JSON.stringify(data), Date.now()],
            (err) => {
                if (err) {
                    console.error("Error saving astronomy data to cache:", err);
                    reject(err);
                } else {
                    console.log("Astronomy data saved to cache successfully");
                    resolve();
                }
            }
        );
    });
}

module.exports = { getCachedWeather, saveWeatherToCache, getCachedForecast, saveForecastToCache, getCachedAstronomy, saveAstronomyToCache };
