import { useState,useEffect, useCallback} from 'react'
import './App.css'
import Card from './Components/Card/Card.js'
import Header from './Components/Header.jsx/Header.jsx'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useInfiniteScroll } from './hooks/useInfiniteScroll.js';

function App() {
  const [countPage,setCountPage]=useState(1)
  const [movies,setMovies]=useState([])
  const [loading,setLoading]=useState(true) // Start with true for initial load
  const [hasMore, setHasMore] = useState(true)
  const [show,setShow]=useState(false)
  const [isToggled,setIsToggled]=useState(
  localStorage.getItem('isToggled') === 'true'||false)
  const [watchList, setWatchList] = useState(() => {
  const saved = localStorage.getItem("watchList");
  return saved ? JSON.parse(saved) : []
});

  const [searchValue,setSearchValue]=useState('')

  // Initial load - fetch first page
  useEffect(()=>{
    const controller=new AbortController();
    const fetchMovies = async()=>{
      try{
        setLoading(true);
        const res=await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d7603adbe3ce81ba74bd005857d1940d&page=1`
        ,{signal:controller.signal}
        );
        const data=await res.json();
        setMovies(data.results||[]);
        setCountPage(2); // Next page to load
        // Check if there are more pages (typically TMDB has ~500 pages, but we'll check)
        setHasMore(data.page < data.total_pages);
      }catch(err){
      console.log("error",err);
    }finally{
      setLoading(false)
    }
    }
    fetchMovies();
    return ()=>{controller.abort();};  
  },[])
  useEffect(() => {
  const onScroll = () =>
    setShow(window.scrollY > window.innerHeight * 2);

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);


  // Load more movies function for infinite scroll
  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;
    
    const controller = new AbortController();
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=d7603adbe3ce81ba74bd005857d1940d&page=${countPage}`,
        { signal: controller.signal }
      );
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
        setCountPage((prevPage) => prevPage + 1);
        setHasMore(data.page < data.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log("error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [countPage, loading, hasMore]);

  // Infinite scroll hook
  const sentinelRef = useInfiniteScroll(loadMoreMovies, hasMore, loading, {
    threshold: 0.1,
    rootMargin: '200px', // Start loading 200px before reaching bottom
  });
  useEffect(() => {
  localStorage.setItem("watchList", JSON.stringify(watchList));
}, [watchList]);
useEffect(()=>{
  localStorage.setItem('isToggled',isToggled)
},[isToggled])
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
     
    <div className={`bigger-container ${isToggled?"dim-light":''}`} style={{position:'relative'}}>

      <Header watchList={watchList}
      isToggled={isToggled}
      setIsToggled={setIsToggled}
      movies={movies}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      />
      {show && <div onClick={()=>{window.scrollTo({ top: 0, behavior: "smooth" });
}} className='go-top'><i className="fa-solid fa-chevron-up"></i>
</div>}
    <div className='box-wrapper'>
    {searchValue.length===0 && !loading && movies.length > 0 && movies.map((movie)=>(
          <div key={movie.id}> 
             <Card tryMovie={movie} 
              watchList={watchList}
              setWatchList={setWatchList}
              isToggled={isToggled}
             />
          </div>
        ))}
    </div>
    
    {/* Loading skeletons - show more on initial load, fewer when loading more */}
    {loading && searchValue.length === 0 && (
      <div className='box-wrapper'>
        {Array(movies.length === 0 ? 20 : 6).fill(0).map((_, i) => (
          <MovieLoadingSceleton key={`skeleton-${i}`} />
        ))}
      </div>
    )}
    
    {/* Infinite scroll sentinel - triggers loadMore when visible */}
    {searchValue.length === 0 && hasMore && (
      <div ref={sentinelRef} style={{ height: '20px', width: '100%' }} />
    )}
    
    {/* End of list message */}
    {searchValue.length === 0 && !hasMore && movies.length > 0 && (
      <div style={{ textAlign: 'center', padding: '2rem', color: isToggled ? '#e5e7eb' : '#1f2937' }}>
        <p>You've reached the end! 🎬</p>
      </div>
    )}
    </div>
    
    </div>
  )
}

export default App

