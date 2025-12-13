import "./Details.css";
import { useLocation, Navigate, useNavigate } from "react-router-dom";

function Details() {
  const location = useLocation();
  const navigate = useNavigate();

  // safely extract tryMovie from route state
  const { tryMovie } = location.state || {};

  // guard: user refreshed or accessed directly
  if (!tryMovie) {
    return <Navigate to="/" replace />;
  }

  const imageUrl = tryMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${tryMovie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

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
            <button className="watchlist-btn">
              Add to Watchlist
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
