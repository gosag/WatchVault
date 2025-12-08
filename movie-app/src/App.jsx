import { useState,useEffect} from 'react'
import './App.css'
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header.jsx/Header.jsx'
function App() {
  const [count, setCount] = useState(0)
  const [movies,setMovies]=useState([])
  useEffect(()=>{
    const fetchMovies = async()=>{
      try{
        const res=await fetch("https://api.themoviedb.org/3/search/movie?api_key=d7603adbe3ce81ba74bd005857d1940d&query=man");
        const data=await res.json();
        setMovies(data.results);
        console.log(data.results);
      }catch(err){
      console.log("error",err); 
    }
    }
    fetchMovies();
    return ()=>{console.log("cleanup")};  
  },[])
  return (
    <>
      <Header/>
      <Card movies={movies}/>
    </>
  )
}

export default App
