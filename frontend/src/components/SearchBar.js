import React, { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import styles from "../App.module.css";

const SearchBar = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);

    const { ref } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        onPlaceSelected: (place) => {
            if (place.geometry) {
                const locationData = {
                    name: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lon: place.geometry.location.lng(),
                };
                onSelect(locationData); // Send selected location to parent component
            }
        },
        options: {
            types: ['geocode'], // Suggests cities, states, zip codes, addresses, etc.
        },
    });

    // Function to get the user's current location
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(`/geocode/reverse?lat=${latitude}&lon=${longitude}`)
                    const data = await response.json();
                    const { name, state, country } = data;

                    // filter out empty fields
                    const formattedName = [name, state, country].filter(Boolean).join(', ');

                    const locationData = {
                        name: formattedName || "Current Location", 
                        lat: latitude,
                        lon: longitude,
                    }
                    onSelect(locationData);

                } catch (error) {
                    console.error("Error fetching location data:", error);
                    alert("Failed to get location details.");
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location.");
                setLoadingLocation(false);
            }
        );
    };

    return (
        <div className={styles.inputContainer}>
            <input
                ref={ref}
                type="text"
                placeholder="Search for a location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className={styles.button} onClick={handleCurrentLocation} disabled={loadingLocation}>
                {loadingLocation ? "Getting Location..." : "Use Current Location"}
            </button>
        </div>
    );
};

export default SearchBar;
