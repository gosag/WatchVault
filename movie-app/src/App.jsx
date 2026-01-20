import { useState,useEffect} from 'react'
import './App.css'
import Card from './Components/Card/Card.jsx'
import Header from './Components/Header.jsx/Header.jsx'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
/*We are so back baby */
/*i guess it is a little bit hard to be back after a month or so but i can do it*/
function App() {
  const [countPage,setCountPage]=useState(JSON.parse(localStorage.getItem('countPage'))||1)
  const [movies,setMovies]=useState([])
  const [loading,setLoading]=useState(false)
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
        setLoading(true);
        const res=await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d7603adbe3ce81ba74bd005857d1940d&page=${countPage}`);
        const data=await res.json();
        setMovies(data.results||[]);
        ;
      }catch(err){
      console.log("error",err);
    }finally{
      setLoading(false)
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
function MovieLoadingSceleton(){
  return(
    <div className='card'>
      <div className='inner-card-container skeleton-container'>
         {/* poster */}
        <Skeleton width={160} height={240} borderRadius={10}
        style={{
            marginTop:15,
            padding:10,
        }}
         />
         {/* title */}
        <Skeleton width={175} height={24.85} 
        style={{
          marginLeft:12
        }}
         />
        {/* star */}
        <Skeleton width={101} height={20}/>
        {/* Details */}
        <Skeleton width={84} height={37}
         style={{marginTop:8,
                 marginBottom:10,
                 padding:10
         }}
        borderRadius={20} />
    </div>
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
    {loading?
    Array(20).
    fill(0)
    .map((_, i) => <MovieLoadingSceleton key={i} />)
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
    {countPage>1 && <button onClick={()=>{setCountPage(prev=>prev-1); setLoading(prev=>!prev)} }>Prev page</button>}
    {countPage!==1 && <button onClick={()=>{setCountPage(1)}}>1</button>}
    <button>Current page: {countPage}</button>
    <button onClick={()=>{setCountPage(prev=>prev+1); setLoading(prev=>!prev)}}>Next page</button>
    </div>
    </div>
    </div>
  )
}

export default App

