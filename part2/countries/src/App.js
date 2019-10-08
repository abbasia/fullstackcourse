import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = ({ searchString, onChange }) => {
  return (
    <div>
      find countries <input value={searchString} onChange={onChange}></input>
    </div>
  );
};

function App() {
  const [items, setItems] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredItems, setFilteredItems] = useState(null);
  const [item, setItem] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    setItem(null);

    setFilteredItems(null);

    const filtered = items.filter(item => {
      return item.name.toLowerCase().includes(searchString.toLowerCase());
    });
    setFilteredItems(filtered);
    if (filtered.length === 1) setItem(filtered[0]);
  }, [searchString, items]);

  useEffect(() => {
    setWeather(null);
    if (item !== null) {
      const url = `http://api.weatherstack.com/current?access_key=55f2c1ee6133e4bdadaedc01e19474ab&query=${item.capital}`;
      axios.get(url).then(response => {
        setWeather(response.data.current);
      });
    }
  }, [item]);

  const tooManyCondition = filteredItems && filteredItems.length > 10;
  const lessThan10Condition =
    filteredItems && filteredItems.length <= 10 && filteredItems.length !== 1;
  return (
    <div>
      <Search
        searchString={searchString}
        onChange={e => setSearchString(e.target.value)}
      ></Search>
      {tooManyCondition && <div>too many matches, specify another filter</div>}
      {lessThan10Condition && (
        <ItemList
          items={filteredItems}
          showItem={item => setItem(item)}
        ></ItemList>
      )}
      {item && <Item item={item} weather={weather}></Item>}
    </div>
  );
}

const Weather = ({ weather, capital }) => {
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>
        <b>temperature: </b>
        {weather.temperature} Celcius
      </div>
      <br></br>
      <img src={weather.weather_icons[0]} alt="weather icon"></img>
      <br></br>
      <div>
        <b>wind: </b>
        {weather.wind_speed} kph direction {weather.wind_dir}
      </div>
    </div>
  );
};

const Item = ({ item, weather }) => {
  return (
    <div>
      <h1>{item.name}</h1>
      <div>capital {item.capital}</div>
      <div>population {item.population}</div>
      <h3>languages</h3>
      <ul>
        {item.languages.map(language => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={item.flag} alt="flag" width="100"></img>
      {weather && <Weather capital={item.capital} weather={weather}></Weather>}
    </div>
  );
};

const ItemList = ({ items, showItem }) => {
  return (
    <>
      {items.map(item => (
        <div key={item.alpha3Code}>
          {item.name} <button onClick={() => showItem(item)}>show</button>
        </div>
      ))}
    </>
  );
};

export default App;
