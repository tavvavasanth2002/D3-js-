import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Inline from './charts/Inline'
import LineChart from './charts/LineChart'
import Radial from './charts/RadialStackedBarChartSorted'
import Choropleth from './charts/Chrolopeth'
import BivariateChoropleth from './charts/BivariateChoropleth'
import StateChoropleth from './charts/StateChoropleth'
import WorldChoropleth from './charts/WorldChoropleth'
import WorldMap from './charts/WorldMap'
import WorldProjections from './charts/WorldProjections'
import Compare from './charts/Compare'
import AntiMerdian from "./charts/AntiMerdian"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Inline></Inline>
    <LineChart></LineChart>
    <Choropleth></Choropleth>
    <BivariateChoropleth></BivariateChoropleth>
    <StateChoropleth></StateChoropleth>
    <WorldChoropleth></WorldChoropleth>
    <WorldMap></WorldMap>
    <div className="bg-secondary">
      <WorldProjections></WorldProjections>
    </div>
    <Compare></Compare>
    <AntiMerdian></AntiMerdian>
    </>
  )
}

export default App
