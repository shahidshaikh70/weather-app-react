import React, { useEffect, useState } from "react";
import { WEATHER_API_URL } from "../../api";
import CurrentWeather from "../../components/current-weather/current-weather";
import Forecast from "../../components/forecast/forecast";



const SearchCity = () => {

    const [search, setSearch] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [city, setCity] = useState(null);
    const [fetchCityError, setFetchCityError] = useState(false);

    useEffect(() => {
        console.log('useEffect called Search City');
        const lastCity = localStorage.getItem("last-city");
        if (lastCity != null) {
            searchUSCity(lastCity);
        }
    }, []);


    const searchUSCity = (searchData) => {
        const currentWeatherFetch = fetch(
            `${WEATHER_API_URL}/weather?q=${searchData},US&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
        );

        var weatherResponse = null;

        Promise.all([currentWeatherFetch])
            .then(async (response) => {
                if (response[0].status == 200) {
                    weatherResponse = await response[0].json();
                    setFetchCityError(false);
                    setCurrentWeather({ city: searchData, ...weatherResponse });
                    getCurrentForecast(weatherResponse);

                    localStorage.setItem("last-city", searchData);
                } else {
                    setCurrentWeather(null);
                    setForecast(null);
                    setFetchCityError(true);
                }
            }).catch(console.log);

    };

    const getCurrentForecast = (weatherResponse) => {
        if (weatherResponse) {
            const currentForecastFetch = fetch(
                `${WEATHER_API_URL}/forecast?lat=${weatherResponse.coord.lat}&lon=${weatherResponse.coord.lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
            );
            Promise.all([currentForecastFetch])
                .then(async (response) => {
                    if (response[0].status == 200) {
                        const forecastFetchResponse = await response[0].json();


                        setForecast({ city: weatherResponse.name, ...forecastFetchResponse });

                    } else {
                        setForecast(null);
                        setCurrentWeather(null);
                        setFetchCityError(true);
                    }
                }).catch(console.log);

        };
    }



    const searchLocation = async (searchData) => {
        setCurrentWeather(null);
        setForecast(null);
        setFetchCityError(false);
        if (searchData.key === 'Enter') {
            searchUSCity(searchData.target.value);
        }

    };


    return (
        <div className="app">
            <div className="search">
                <input
                    id="city"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    onKeyDown={searchLocation}
                    placeholder='Enter US City'
                    type="text" />

            </div>
            {fetchCityError && <div className="error">

                Please enter a valid US City
            </div>}
            {currentWeather && <CurrentWeather data={currentWeather} />}
            {forecast && <Forecast data={forecast} />}

        </div>

    );
};

export default SearchCity;