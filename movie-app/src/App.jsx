import { useState,useEffect} from 'react'
import './App.css'
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header.jsx/Header.jsx'
function App() {
  const [movies,setMovies]=useState([])
  const [showMovies,setShowMovies]=useState(false)
  const [watchList, setWatchList] = useState(() => {
  const saved = localStorage.getItem("watchList");
  return saved ? JSON.parse(saved) : []
});
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
  useEffect(() => {
  localStorage.setItem("watchList", JSON.stringify(watchList));
}, [watchList]);
  return (
    <div className='bigger-container'>
      <Header watchList={watchList}/>
    <div className='box-wrapper'>
     { showMovies &&
       movies.map((movie)=>(
          <div key={movie.id}> 
             <Card tryMovie={movie} 
              watchList={watchList}
              setWatchList={setWatchList}
             />
          </div>
        ))
      }
    </div>
    </div>
  )
}

export default App
