import { useEffect, useState } from "react";
import "./watchList.css";
import { Link } from "react-router-dom";
function WatchList() {
    const [watchList,setWatchList]=useState([])
    const [toggle,setToggle]=useState( localStorage.getItem('isToggled') === 'true'||false)
    useEffect(() => {
    localStorage.setItem('isToggled', toggle.toString());
  }, [toggle]);
useEffect(() => {
  console.log(localStorage.getItem("watchList"));
}, []);

    useEffect(()=>{
        const stored = localStorage.getItem('watchList');
        const storedList = stored ? JSON.parse(stored) : [];
        setWatchList(storedList)
    },[])
    function RemoveHandler(id:number){
        const filteredMovies=watchList.filter((movie:{id:number})=>movie.id!==id)
        setWatchList(filteredMovies)
        localStorage.setItem(
        "watchList",
        JSON.stringify(filteredMovies)
    );
        
    }
if (watchList.length === 0) {
  return (
    <div className="empty-watchlist">
      <h2>Your Watchlist is Empty</h2>
      <p>Add some movies first.</p>
    </div>
  );
}


  return(
    <div className={`page-container ${!toggle?"bright-watchlist":""}`}>
       <Link to="/"><i className="fa-solid fa-chevron-left go-top"></i>
     </Link> 
        <h2 className="watchlist-header">My watchlist</h2>
        <div className="movies-container">
        {watchList.map((movie:{title:string,id:number,vote_average:number})=>(
            <div className="card-container" key={movie.id}>
                <div className="image-contain">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                         alt={movie.title}/>
                </div>
                <div className="watchList-info">
                    <div className="watchlist-title">{movie.title}</div>
                    <div className="movie-rating">{movie.vote_average}</div>
                </div>
                <button className="remove-btn" onClick={()=>{
                    RemoveHandler(movie.id)
                }}>Remove</button>

            </div>
        ))}
        </div>
      
    </div>
  )   
 
}

export default WatchList;
