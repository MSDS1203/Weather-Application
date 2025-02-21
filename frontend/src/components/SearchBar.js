import React, { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import styles from "../App.module.css";

const SearchBar = ({ onSelect }) => {
    const [query, setQuery] = useState('');

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
            types: ['geocode'], // Suggests only cities
            componentRestrictions: { country: "us" }, // Limit search to the US (optional)
        },
    });

    return (
        <div className={styles.inputContainer}>
            <input
                ref={ref}
                type="text"
                placeholder="Search for a city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
