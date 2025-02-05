import React from "react";
import './saved.css';

const Saved = () => {
    const locations = {
        "Cary": ["NC", 28, "3:42pm"],
        "Greenville": ["NC", 34, "3:42pm"]
    };
    return (
        <div>
            <h1>Saved Locations</h1>
            <div>
                {Object.entries(locations).map(([location, values]) => (
                    <div class = "savedLoc">
                        <h3>{location}</h3>
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