import { useState } from 'react'
import './App.css'
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header.jsx/Header.jsx'
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <Card />
      <Header/>
    </>
  )
}

export default App
