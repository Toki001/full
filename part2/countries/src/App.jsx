import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const CountryDetails = ({ country, weather }) => {
  return( 
    <div>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((name) => <li key={name}>{name}</li>)}
        </ul>
        <img src={country.flags.png} style={{ height: '200px' }} alt="flag" />
        
        {weather && weather.main && (
          <div>
            <h2>Weather in {country.capital}</h2>
            <div>Temperature: {weather.main.temp} °C</div>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
            <div>Wind: {weather.wind.speed} m/s</div>
          </div>
        )}
    </div>
  )
}

const CountriesToShow = ({ countriesFilter, setSelected }) => {
  if (countriesFilter.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countriesFilter.length === 1) {
    const country = countriesFilter[0]
    return <CountryDetails country={country} />
  }
  return (
    <div>
      {countriesFilter.map((country) => 
        <div key={country.name.common}>
          {country.name.common} <button onClick={() => setSelected(country)}>Show</button>
        </div>
     )}
   </div>
  )}


const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] =useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  useEffect(() => {
    if (!selected || !selected.capital || selected.capital.length === 0) return

    const capital = selected.capital[0]
    const lat = selected.capitalInfo?.latlng?.[0]
    const lon = selected.capitalInfo?.latlng?.[1]

    if (lat && lon) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch((error) => {
          console.error('Weather fetch failed', error)
          setWeather(null)
        })
    }
  }, [selected])

  const countriesFilter = countries.filter(country => 
    country.name.common.toLowerCase().includes(query.toLowerCase())
  )
  const handleQuery = (event) => {
    setQuery(event.target.value)
    setSelected(null)
    setWeather(null)
  }


  return (
    <div>
      <div>find countries <input value={query} onChange={handleQuery}/></div>
      {
        selected
          ? <CountryDetails country={selected} weather={weather} />
          : <CountriesToShow countriesFilter={countriesFilter} setSelected={setSelected} />
      }
    </div>
  )
}

export default App