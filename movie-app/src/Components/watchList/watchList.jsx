import { useEffect, useState } from "react";
import "./watchList.css";
import { Link } from "react-router-dom";
function WatchList() {
    const [watchList,setWatchList]=useState([])
    const [toggle,setToggle]=useState( localStorage.getItem('isToggled') === 'true'||false)
    useEffect(() => {
    localStorage.setItem('isToggled', toggle);
  }, [toggle]);

    useEffect(()=>{
        const storedList=JSON.parse(localStorage.getItem('watchList'))||[];
        setWatchList(storedList)
    },[])
    function RemoveHandler(id){
        const filteredMovies=watchList.filter((movie)=>movie.id!==id)
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
        <h2 className="watchlist-header">My watchlist</h2>
        <div className="movies-container">
        {watchList.map((movie)=>(
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
