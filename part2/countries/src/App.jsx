import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const CountriesToShow = ({ countriesFilter }) => {
  if (countriesFilter.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countriesFilter.length === 1) {
    const country = countriesFilter[0]
    return (
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
  return (
    <div>
      {countriesFilter.map((country) => 
        <div key={country.name.common}>
          {country.name.common}
        </div>
     )}
   </div>
  )}


const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

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
  const handleQuery = (event) => setQuery(event.target.value)

  return (
    <div>
      <form>find countries <input value={query} onChange={handleQuery}/></form>
      <CountriesToShow countriesFilter={countriesFilter}/>
    </div>
  )
}

export default App