import './Header.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type MovieType = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

type HeaderType = {
  isToggled: boolean,
  searchValue: string,
  movies: MovieType[],
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

const Header = ({ isToggled, setIsToggled, movies, searchValue, setSearchValue }: HeaderType) => {
  const [watchList, setWatchList] = useState(() => {
    const saved = localStorage.getItem("watchList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem("watchList");
    setWatchList(saved ? JSON.parse(saved) : []);
  }, []);

  const [recs, setRecs] = useState([
  {
    title: 'Mad Max: Fury Road',
    year: 2015,
    genre: 'Action, Sci-Fi, Adventure',
    reason: "Its relentless, high-octane practical action sequences and immersive world-building would appeal to your enjoyment of the thrilling spectacles in 'Top Gun: Maverick'."
  },
  {
    title: 'Mission: Impossible - Fallout',
    year: 2018,
    genre: 'Action, Thriller, Adventure',
    reason: "Much like 'Top Gun: Maverick', this film delivers incredibly high-stakes, well-choreographed practical action, edge-of-your-seat suspense, and a compelling plot."
  },
  {
    title: 'Dune',
    year: 2021,
    genre: 'Sci-Fi, Action, Adventure',
    reason: "With its epic scale, stunning visuals, and blend of sci-fi action with grand adventure, 'Dune' should resonate with your appreciation for immersive worlds and significant action, similar to the fantasy elements in 'Mortal Kombat II' and the scale of 'Top Gun: Maverick'."
  },
  {
    title: 'John Wick: Chapter 4',
    year: 2023,
    genre: 'Action, Thriller, Crime',
    reason: "If you enjoyed the martial arts and intense combat in 'Mortal Kombat II', this film takes action choreography to another level with its stylish, relentless, and incredibly well-executed fight sequences."
  },
  {
    title: 'Edge of Tomorrow',
    year: 2014,
    genre: 'Sci-Fi, Action, Adventure',
    reason: "This movie combines thrilling sci-fi action and an intriguing premise, featuring intense combat against alien invaders and a dynamic protagonist, echoing the sci-fi elements of 'Mortal Kombat II' and the fast-paced action of 'Top Gun: Maverick'."
  }
]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_URL || 'http://localhost:3001';

  const getRecommendations = async () => {
    if (watchList.length === 0) {
      alert("Your watchlist is empty! Please add some movies to get recommendations.");
      return;
    }
   return
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movies: watchList })
      });

      const data = await res.json();
      setRecs(data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredValue = movies.length > 0
    ? movies.filter((movie) => movie.title.toLowerCase().includes(searchValue.toLowerCase()))
    : [];

  const logged = localStorage.getItem("user") !== null;

  return (
    <div>
      <div className="header-container">
        <div className='inner-header-container'>
          <input
            className='search-input'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search Movies"
          />
          {searchValue.length > 0 &&
            <div
              className={`cancel-button ${!isToggled ? "cancel-light-theme" : ""}`}
              onClick={() => setSearchValue('')}
            >
              <i className="fa-solid fa-xmark-circle"></i>
            </div>
          }
        </div>

        <Link to={logged ? "/watchList" : "/login"} state={{ isToggled }}>
          <button className="search-button watchlist">
            <i className="fa-solid fa-bookmark"></i>
          </button>
        </Link>

        <button className="ai-reccomendation" onClick={getRecommendations} disabled={loading}>
          <i className="fa-solid fa-thumbs-up"></i>
          {loading ? 'Getting picks...' : 'Get AI Recommendations'}
        </button>

        <div
          className={`toggle-theme ${!isToggled ? "not-toggled" : "toggled"}`}
          onClick={() => setIsToggled(prevS => !prevS)}
        >
          <div className={`toggle-circle ${isToggled ? "on-state" : "off-state"}`}></div>
        </div>
      </div>

      {recs.length > 0 &&
        <div className="recs-container">
          {recs.map((rec: any) => (
            <div key={rec.title} className="rec-card">
              <h4>{rec.title} ({rec.year})</h4>
              <p>{rec.genre}</p>
              <p>{rec.reason}</p>
            </div>
          ))}
        </div>
      }

      {searchValue.length > 0 &&
        <div>
          <div className={`match-not-found ${isToggled ? "no-watch-light-theme" : ""}`}>
            {filteredValue.length === 0 ? "SRY! Match is not found. PLS Try loading more movies" : ""}
          </div>
          {filteredValue.map((tryMovie) => (
            <Link to="/Details" state={{ tryMovie }} className='search-result' key={tryMovie.id}>
              <div className={`header-title-box ${!isToggled ? "search-list-color" : ""}`}>
                <div><i className="fa-solid fa-film"></i></div>
                <div className='search-result-card'>{tryMovie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      }
    </div>
  )
}

export default Header;