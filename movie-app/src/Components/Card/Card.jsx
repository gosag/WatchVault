import "./Card.css";
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Card = ({ tryMovie, watchList, setWatchList, isToggled }) => {
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
    movie => movie.id === tryMovie.id
  );
  const LoggedIn=localStorage.getItem("user")!==null;
  function toggleWatchList() {
    if(LoggedIn){
      navigate("/login");
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
        <div className="image-wrap">
          <img
            className="movie-poster blur"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
            alt={tryMovie.title}
          />
          <img
            className="movie-poster main"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w500${imageUrl}`}
            alt={tryMovie.title}
          />
        </div>

        <div className={`movie-title ${!isToggled ? "black-title" : ""}`}>
          {tryMovie.title}
        </div>

        <div className="movie-info">
          <div className="vote-average">
            <img
              className="star-image"
              src={`../../../ratings/${ratingValue}`}
              alt="rating"
            />
          </div>
        </div>

        <Link
          to="Details"
          state={{ tryMovie, isToggled }}
        >
          <button className="full-details">Details</button>
        </Link>

        <div
          className={`fav-container ${isFavorite ? "is-favourite" : ""}`}
          onClick={toggleWatchList}
        >
          <i className="fa-solid fa-heart"></i>
        </div>
      </div>
    </div>
  );
};

export default Card;
