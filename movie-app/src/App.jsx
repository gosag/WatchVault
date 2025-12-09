import { useState,useEffect} from 'react'
import './App.css'
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header.jsx/Header.jsx'
function App() {
  const [count, setCount] = useState(0)
  const [movies,setMovies]=useState([])
  const [showMovies,setShowMovies]=useState(false)
  const [forCartComponent,setForCartComponent]=useState([])
  useEffect(()=>{
    const fetchMovies = async()=>{
      try{
        const res=await fetch("https://api.themoviedb.org/3/movie/popular?api_key=d7603adbe3ce81ba74bd005857d1940d&page=1");
        const data=await res.json();
        setMovies(data.results);
        setShowMovies(true)
        if (data.results && data.results.length > 0) {
        setMovies(data.results);
        setShowMovies(true);    // turn it on only if data exists
        }
      }catch(err){
      console.log("error",err);
    }
    }
    fetchMovies();
    return ()=>{console.log("cleanup")};  
  },[])

  return (
    <div className='bigger-container'>
      <Header/>
      {showMovies &&
       movies.map((movie)=>(
          <div>
            {movie.poster_path && 
             /* movie.title.length<12
            &&  */
             <Card tryMovie={movie}/>}
          </div>
        ))
      }
      
    </div>
  )
}

export default App
