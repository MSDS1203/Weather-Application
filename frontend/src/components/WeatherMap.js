import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const WeatherMap = ({ lat, lon }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_API_KEY,
    });

    const containerStyle = {
        width: "100%",
        height: "100%",
    };

    const [radarTime, setRadarTime] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    // Fetch the latest radar timestamp
    useEffect(() => {
        const fetchRadarTime = async () => {
            try {
                const response = await fetch("https://api.rainviewer.com/public/weather-maps.json");
                const data = await response.json();
                const latestTime = data.radar.nowcast[0]; // latest radar timestamp
                console.log("Latest radar time:", latestTime);
                console.log('Host: ', data.host);
                setRadarTime(latestTime);
            } catch (error) {
                console.error("Error fetching radar time:", error);
            }
        };

        fetchRadarTime();
    }, []);

     // Add radar layer to map when both radarTime and mapInstance are available
     useEffect(() => {
        console.log("useEffect triggered: mapInstance =", mapInstance, "radarTime =", radarTime);
        if (mapInstance && radarTime) {
            console.log("Adding radar layer to map");
            const radarLayer = new window.google.maps.ImageMapType({
                getTileUrl: (coord, zoom) => {
                    const url = `https://tilecache.rainviewer.com${radarTime.path}/${256}/${zoom}/${coord.x}/${coord.y}/1/1_0.png`;
                    console.log("Radar Tile URL:", url);
                    return url;
                },
                tileSize: new window.google.maps.Size(256, 256),
                opacity: 0.7,
                name: "Radar",
            });

            mapInstance.overlayMapTypes.insertAt(0, radarLayer);
            console.log("Radar layer added to map");
        }
    }, [mapInstance, radarTime]);

    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: parseFloat(lat), lng: parseFloat(lon) }}
            zoom={8}
            options={{
                mapTypeId: "roadmap",
            }}
            onLoad={(map) => {
                console.log("Map loaded:", map);
                setMapInstance(map);
            }}
        >
            <Marker position={{ lat: parseFloat(lat), lng: parseFloat(lon) }} />
        </GoogleMap>
    );
};

export default WeatherMap;