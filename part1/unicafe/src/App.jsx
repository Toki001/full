import { useState } from "react"

const StatisticsLine = ({ text,value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good,neutral,bad }) => {

  const all = good + neutral + bad
  const average = (good - bad) / (all || 1)
  const positive = (good / (all || 1)) * 100

  if (all === 0){
    return (<div>No feedback given</div>)
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good}/>
        <StatisticsLine text="neutral" value={neutral}/>
        <StatisticsLine text="bad" value={bad}/>
        <StatisticsLine text="all" value={all}/>
        <StatisticsLine text="average" value={average.toFixed(1)}/>
        <StatisticsLine text="positive" value={positive.toFixed(1) + " %"}/>
      </tbody>
    </table>
  )
}

const Button = ({ onClick,text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h2>give feedback</h2>
        <Button onClick={handleGood} text="good" />
        <Button onClick={handleNeutral} text="neutral" />
        <Button onClick={handleBad} text="bad" />
      <h2>statistics</h2>
      <Statistics 
        good={good} 
        neutral={neutral}
        bad={bad}
        />
    </div>
  )
}

export default App