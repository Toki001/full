import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const CountryDetails = ({ country }) => {
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

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const countriesFilter = countries.filter(country => 
    country.name.common.toLowerCase().includes(query.toLowerCase())
  )
  const handleQuery = (event) => {
    setQuery(event.target.value)
    setSelected(null)
  }


  return (
    <div>
      <div>find countries <input value={query} onChange={handleQuery}/></div>
      {
        selected
          ? <CountryDetails country={selected} />
          : <CountriesToShow countriesFilter={countriesFilter} setSelected={setSelected} />
      }
    </div>
  )
}

export default App