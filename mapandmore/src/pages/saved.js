import React from "react";
import './saved.css';

const Saved = () => {
    const locations = {
        "Cary": ["NC", 28, "3:42pm"],
        "Greenville": ["NC", 34, "3:42pm"]
    };

    const unsaveLocation = (key) => {
        
    };

    return (
        <div>
            <h1>Saved Locations</h1>
            <div>
                {Object.entries(locations).map(([location, values]) => (
                    <div className = "savedLoc">
                        <h3>{location}</h3>
                        <button type="button">Unsave Location</button>
                        <div>
                            {values.map((value, index) => (
                                <div>{value}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Saved;