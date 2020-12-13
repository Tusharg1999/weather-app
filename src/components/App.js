import React, { useState } from 'react';
import styled from 'styled-components';
import CityInput from './CityInput';
import device from '../responsive/Device';
import Result from './Result';
import NotFound from './NotFound';

const ApplicationTitle = styled.h1`
  display: block;
  height: 64px;
  margin: 0;
  padding: 20px 0;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 400;
  transition: 0.5s 1.3s;
  opacity: ${({ showLabel }) => (showLabel ? 1 : 0)};
  color: #ffffff;

  ${({ secondary }) =>
    secondary &&
    `
    opacity: 1;
    height: auto;
    position: relative;
    padding: 20px 0;
    font-size: 30px;
    top: 20%;
    text-align: center;
    transition: .5s;
    @media ${device.tablet} {
      font-size: 40px;
    }
    @media ${device.laptop} {
      font-size: 50px;
    }
    @media ${device.laptopL} {
      font-size: 60px;
    }
    @media ${device.desktop} {
      font-size: 70px;
    }
    
  `}

  ${({ showResult }) =>
    showResult &&
    `
    opacity: 0;
    visibility: hidden;
    top: 10%;
  `}
`;

const WeatherContainer = styled.div`
  height: calc(100vh - 64px);
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

function App() {
  const [value, setValue] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  const inputHandler = function (e) {
    setValue(e.target.value)
  };

  const cityHandler = function (e) {
    e.preventDefault();
    const APIkey = "942dc14372785894bb90aee8095181c1";

    const weather = `https://api.openweathermap.org/data/2.5/weather?q=${value}&APPID=${APIkey}&units=metric`;
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&APPID=${APIkey}&units=metric`;

    Promise.all([fetch(weather), fetch(forecast)])
      .then(([res1, res2]) => {
        if (res1.ok && res2.ok) {
          return Promise.all([res1.json(), res2.json()]);
        }
        throw Error(res1.statusText, res2.statusText);
      })
      .then(([resData, resList]) => {
        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'Nocvember',
          'December',
        ];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDate = new Date();
        const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
          }`;
        const sunset = new Date(resData.sys.sunset * 1000).toLocaleTimeString().slice(0, 5);
        const sunrise = new Date(resData.sys.sunrise * 1000).toLocaleTimeString().slice(0, 5);

        const weather = {
          city: resData.name,
          country: resData.sys.country,
          date,
          description: resData.weather[0].description,
          main: resData.weather[0].main,
          temp: resData.main.temp,
          highestTemp: resData.main.temp_max,
          lowestTemp: resData.main.temp_min,
          sunrise,
          sunset,
          clouds: resData.clouds.all,
          humidity: resData.main.humidity,
          wind: resData.wind.speed,
          forecast: resList.list,
        };
        setWeather(weather);
        setError(false)
      })
      .catch(error => {
        setError(true);
        setWeather(null)
      });
  };

  return (
    <>
      <ApplicationTitle showLabel={(weather || error) && true}>Weather app</ApplicationTitle>
      <WeatherContainer>
        <ApplicationTitle secondary showResult={(weather || error) && true}>
          Weather app
          </ApplicationTitle>
        <CityInput
          value={value}
          showResult={(weather || error) && true}
          change={inputHandler}
          submit={cityHandler}
        />
        {weather && <Result weather={weather} />}
        {error && <NotFound error={error} />}
      </WeatherContainer>
    </>
  );

}

export default App;
