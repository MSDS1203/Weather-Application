import React, { useState } from "react";
import styles from "./ForecastTabs.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ForecastTabs = ({ hourlyForecast, dailyForecast }) => {
    const [activeTab, setActiveTab] = useState("hourly");

    const settings = {
        dots: true,
        infinite: false,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 4,
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
            <div className={styles.tabButtons}>
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
                <Slider {...settings}>
                    {hourlyForecast.map((hour, index) => (
                        <div key={index} className={styles.forecastCard}>
                            <p>{hour.dt_txt}</p>
                            <img
                                src={`http://openweathermap.org/img/w/${hour.weather[0].icon}.png`}
                                alt="weather icon"
                            />
                            <p>{hour.main.temp}°F</p>
                            <p>{hour.weather[0].description}</p>
                        </div>
                    ))}
                </Slider>
            )}


            {activeTab === "daily" && (
                <Slider {...settings}>
                    {dailyForecast.map((day, index) => (
                        <div key={index} className={styles.forecastCard}>
                            <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                            <img
                                src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                                alt="weather icon"
                            />
                            <p>High: {day.temp_max}°F</p>
                            <p>Low: {day.temp_min}°F</p>
                            <p>{day.weather[0].description}</p>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default ForecastTabs;
