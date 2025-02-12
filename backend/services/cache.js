const db = require("./sqliteDB");

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

module.exports = { getCachedWeather, saveWeatherToCache };
