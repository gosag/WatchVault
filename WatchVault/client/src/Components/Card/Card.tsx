import "./Card.css";
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
  type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  vote_average: number;
  release_year?: string;
};
type CardProps={
  watchList:any,
  setWatchList: React.Dispatch<React.SetStateAction<Movie[]>>,
  tryMovie:{
    id:number,
    title:string,
    poster_path:string,
    vote_average:number,
    release_date?:string
  },
  isToggled:boolean
}
const Card = ({ tryMovie, watchList, setWatchList, isToggled }: CardProps) => {
  const [ratingValue, setRatingValue] = useState("rating-0.png");
  const navigate = useNavigate();
  useEffect(() => {
    const vote = tryMovie.vote_average;
    if (vote < 1) setRatingValue("rating-0.png");
    else if (vote < 2) setRatingValue("rating-05.png");
    else if (vote < 3) setRatingValue("rating-10.png");
    else if (vote < 4) setRatingValue("rating-15.png");
    else if (vote < 5) setRatingValue("rating-20.png");
    else if (vote < 6) setRatingValue("rating-25.png");
    else if (vote < 7) setRatingValue("rating-30.png");
    else if (vote < 8) setRatingValue("rating-35.png");
    else if (vote < 9) setRatingValue("rating-40.png");
    else if (vote < 10) setRatingValue("rating-45.png");
    else setRatingValue("rating-50.png");
  }, [tryMovie.vote_average]);
  const isFavorite = watchList.some(
    (movie: any) => movie.id === tryMovie.id
  );
  const LoggedIn=localStorage.getItem("user")!==null;
  function toggleWatchList() {
    if(!LoggedIn){
      navigate("/login", { state: { isToggled: isToggled } });
    }
    else{
    if (isFavorite) {
      setWatchList(prev =>
        prev.filter(movie => movie.id !== tryMovie.id)
      );
    } else {
      setWatchList(prev => [...prev, tryMovie]);
    }
  }}
 
const imageUrl = tryMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${tryMovie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  return (
    <div className={`card ${isToggled ? "dim-light-card" : ""}`}>
      <div className="inner-card-container">
        
        {/* Favorite Button Overlay */}
        <div
          className={`fav-container ${isFavorite ? "is-favourite" : ""}`}
          onClick={toggleWatchList}
          title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <i className="fa-solid fa-heart"></i>
        </div>

        {/* Poster Background */}
        <img
          className="movie-poster"
          loading="lazy"
          src={imageUrl}
          alt={tryMovie.title}
        />

        {/* Content Overlay */}
        <div className="card-overlay">
          <div className="content-wrapper">
            <h3 className="movie-title" title={tryMovie.title}>
              {tryMovie.title}
            </h3>

            <div className="movie-info">
              <div className="vote-average">
                <img
                  className="star-image"
                  src={`/ratings/${ratingValue}`}
                  alt="rating"
                />
                <span className="rating-text">{(tryMovie.vote_average).toFixed(1)}</span>
              </div>
              
              
            </div>
            <div className="release-year-container">
            {tryMovie.release_date && (
                <div className="release-year">{tryMovie.release_date.split('-')[0]}</div>
              )}
            </div>

            <div className="action-wrapper">
              <Link to="Details" state={{ tryMovie, isToggled }} className="details-link">
                <button className="full-details">
                  <i className="fa-solid fa-play"></i> View Details
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Card;
