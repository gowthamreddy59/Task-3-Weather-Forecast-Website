import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './Weather.css';

const Weather = ({ setCoordinates }) => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (lat, lon) => {
    const API_KEY = 'YOUR_API_KEY';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    setWeather(response.data);
  };

  const handleSearch = async () => {
    const API_KEY = 'YOUR_API_KEY';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    );
    setWeather(response.data);
    setCoordinates({ lat: response.data.coord.lat, lon: response.data.coord.lon });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
        setCoordinates({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => console.error(error)
    );
  }, [setCoordinates]);

  return (
    <div className="weather">
      <div className="search">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      {weather && (
        <div className="current-weather">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>{Math.round(weather.main.temp)}°C</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Forecast.css';

const Forecast = ({ coordinates }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      if (coordinates) {
        const API_KEY = 'YOUR_API_KEY';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`
        );
        setForecast(response.data.list.filter((_, index) => index % 8 === 0));
      }
    };
    fetchForecast();
  }, [coordinates]);

  return (
    <div className="forecast">
      {forecast.map((day) => (
        <div key={day.dt} className="forecast-day">
          <h3>{new Date(day.dt_txt).toLocaleDateString()}</h3>
          <p>{day.weather[0].description}</p>
          <p>{Math.round(day.main.temp)}°C</p>
        </div>
      ))}
    </div>
  );
};

export default Forecast;
import React, { useState } from 'react';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import './App.css';

const App = () => {
  const [coordinates, setCoordinates] = useState(null);

  return (
    <div className="app">
      <Weather setCoordinates={setCoordinates} />
      {coordinates && <Forecast coordinates={coordinates} />}
    </div>
  );
};

export default App;
