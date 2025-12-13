import { useEffect, useState } from "react";
import "./WatchList.css";

function WatchList() {
    const [watchList,setWatchList]=useState([])
    useEffect(()=>{
        const storedList=JSON.parse(localStorage.getItem('watchList'))||[];
        setWatchList(storedList)
    },[])
    function RemoveHandler(id){
        const filteredMovies=watchList.filter((movie)=>movie.id!==id)
        setWatchList(filteredMovies)
    }
 if(watchList.length===0){
    return(
        <div>
            <h2>Your watchList is empty</h2>
            <p>Add some movies first.</p>
        </div>
    )
 }
  return(
    <div className="page-container">
        <h2 className="watchlist-header">My watchlist</h2>\
        <div className="movies-container">
        {watchList.map((movie)=>(
            <div className="card-container" key={movie.id}>
                <div className="image-container">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                         alt={movie.title}/>
                </div>
                <div className="info">
                    <div>{movie.title}</div>
                    <div>⭐ {movie.vote_average}</div>
                </div>
                <button className="romove-button" onClick={()=>{
                    RemoveHandler(movie.id)
                }}>Remove</button>

            </div>
        ))}
        </div>
    </div>
  )   
 
}

export default WatchList;
