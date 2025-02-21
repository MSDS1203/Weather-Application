import React, { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

const SearchBar = ({ onSelect }) => {
    const [query, setQuery] = useState('');

    const { ref } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        onPlaceSelected: (place) => {
            if (place.geometry) {
                const locationData = {
                    name: place.name,
                    lat: place.geometry.location.lat(),
                    lon: place.geometry.location.lng(),
                };
                onSelect(locationData); // Send selected location to parent component
            }
        },
        options: {
            types: ['(cities)'], // Suggests only cities
            componentRestrictions: { country: "us" }, // Limit search to the US (optional)
        },
    });

    return (
        <input
            ref={ref}
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
};

export default SearchBar;
