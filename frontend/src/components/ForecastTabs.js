import React, { useState } from "react";
import styles from "./ForecastTabs.module.css";

const ForecastTabs = ({ hourlyForecast, dailyForecast }) => {
    const [activeTab, setActiveTab] = useState("hourly");

    const settings = {
        infinite: false,
        speed: 1000,
        slidesToShow: 7,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
        ],
    };

    return (
        <div>
            <div className={styles.forecast}>
                <button
                    className={activeTab === "hourly" ? styles.active : ""}
                    onClick={() => setActiveTab("hourly")}
                >
                    Hourly Forecast
                </button>
                <button
                    className={activeTab === "daily" ? styles.active : ""}
                    onClick={() => setActiveTab("daily")}
                >
                    Daily Forecast
                </button>
            </div>

            {activeTab === "hourly" && (
                hourlyForecast.map((hour, index) => (
                    <div key={index} className={styles.foreBox}>
                        <p>{hour.dt_txt}</p>
                        <img
                            src={`http://openweathermap.org/img/w/${hour.weather[0].icon}.png`}
                            alt="weather icon"
                        />
                        <p>{hour.main.temp}°F</p>
                        <p>{hour.weather[0].description}</p>
                    </div>
                ))
            )}


            {activeTab === "daily" && (
                dailyForecast.map((day, index) => (
                    <div key={index} className={styles.foreBox}>
                        <p>{day.dt_txt}</p>
                        <img
                            src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                            alt="weather icon"
                        />
                        <p>High: {day.temp.max}°F</p>
                        <p>Low: {day.temp.min}°F</p>
                        <p>{day.weather[0].description}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ForecastTabs;
