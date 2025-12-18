import { useState,useEffect} from 'react'
import './App.css'
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header.jsx/Header.jsx'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
function App() {
  const [countPage,setCountPage]=useState(JSON.parse(localStorage.getItem('countPage'))||1)
  const [movies,setMovies]=useState([])
  const [showMovies,setShowMovies]=useState(false)
  const [isToggled,setIsToggled]=useState(
  localStorage.getItem('isToggled') === 'true'||false)
  const [watchList, setWatchList] = useState(() => {
  const saved = localStorage.getItem("watchList");
  return saved ? JSON.parse(saved) : []
});

  const [searchValue,setSearchValue]=useState('')
  useEffect(()=>{
    const fetchMovies = async()=>{
      try{
        const res=await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d7603adbe3ce81ba74bd005857d1940d&page=${countPage}`);
        const data=await res.json();
        setMovies(data.results);
        setShowMovies(true)
        if (data.results && data.results.length > 0) {
        setMovies(data.results);
        setShowMovies(true);
        }
      }catch(err){
      console.log("error",err);
    }
    }
    fetchMovies();
    return ()=>{console.log("cleanup")};  
  },[countPage])
  useEffect(() => {
  localStorage.setItem("watchList", JSON.stringify(watchList));
}, [watchList]);
useEffect(()=>{
  localStorage.setItem('isToggled',isToggled)
},[isToggled])
useEffect(()=>{
  localStorage.setItem('countPage',JSON.stringify(countPage))
})
function MovieSceleton(){
  return(
    <div className='card'>
      <div>Wait the data loading...</div>
      {/* poster */}
      <Skeleton height={240} width={240}/>
     </div>
  )
}
  return (
    <div>
    <div className={`bigger-container ${isToggled?"dim-light":''}`}>
      <Header watchList={watchList}
      isToggled={isToggled}
      setIsToggled={setIsToggled}
      movies={movies}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      />
    <div className='box-wrapper'>
    {!showMovies?
    
      <MovieSceleton/>
     : searchValue.length===0 &&
       movies.map((movie)=>(
          <div key={movie.id}> 
             <Card tryMovie={movie} 
              watchList={watchList}
              setWatchList={setWatchList}
              isToggled={isToggled}

             />
          </div>
        ))
      }
    </div>
    <div className='page-change-buttons'>
    {countPage>1 && <button onClick={()=>{setCountPage(prev=>prev-1)}}>Prev page</button>}
    {countPage!==1 && <button onClick={()=>{setCountPage(1)}}>1</button>}
    <button>Current page: {countPage}</button>
    <button onClick={()=>{setCountPage(prev=>prev+1)}}>Next page</button>
    </div>
    </div>
    </div>
  )
}

export default App
