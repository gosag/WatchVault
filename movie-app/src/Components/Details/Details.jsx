import "./Details.css";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInWatchList, setIsInWatchList] = useState(false);
  // safely extract tryMovie from route state
  const { tryMovie } = location.state || {};

  // guard: user refreshed or accessed directly
  if (!tryMovie) {
    return <Navigate to="/" replace />;
  }

  const imageUrl = tryMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${tryMovie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  useEffect(()=>{
    const watchList=JSON.parse(localStorage.getItem('watchList'))||[];
      const exists=watchList.some(movie=>movie.id===tryMovie.id)
      setIsInWatchList(exists)
    
  },[tryMovie.id])
  const handleAddToWatchList = () => {
  const watchList =
    JSON.parse(localStorage.getItem("watchList")) || [];

  if (isInWatchList) {
    return;
  }

  const updatedWatchList = [...watchList, tryMovie];
  localStorage.setItem(
    "watchList",
    JSON.stringify(updatedWatchList)
  );

  setIsInWatchList(true);
};

  return (
    <div className="details-page">
      <div className="details-container">
        {/* Poster */}
        <div className="poster">
          <img src={imageUrl} alt={tryMovie.title} />
        </div>

        {/* Info */}
        <div className="info">
          <h1 className="title">{tryMovie.title}</h1>

          <div className="meta">
            <span>⭐ {tryMovie.vote_average}</span>
            <span>📅 {tryMovie.release_date}</span>
            <span>🔥 Popularity: {Math.round(tryMovie.popularity)}</span>
          </div>

          <p className="overview">{tryMovie.overview}</p>

          <div className="actions">
            <button
              className="watchlist-btn"
              onClick={handleAddToWatchList}
              disabled={isInWatchList}
            >
              {isInWatchList ? "In Watchlist ✔" : "Add to Watchlist"}
            </button>


            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
