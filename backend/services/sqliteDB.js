const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const fs = require('fs');

// Ensure the database path exists
const dbFolder = path.resolve(__dirname, '../database');
const dbPath = path.resolve(__dirname, '../database/weather_app.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("SQLite error:", err);
    else console.log("Connected to SQLite for geolocation storage");
});

// Create table for caching geolocation data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS geolocation (
            location TEXT PRIMARY KEY,
            lat REAL,
            lon REAL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS weather_cache (
            location TEXT PRIMARY KEY,
            data TEXT,
            timestamp INTEGER
        )
    `);
});



module.exports = db;
