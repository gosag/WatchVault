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

type RecType = {
  title: string;
  year: number;
  genre: string;
  reason: string;
}

type HeaderType = {
  isToggled: boolean,
  searchValue: string,
  movies: MovieType[],
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
 headerWatchList: MovieType[],
    setHeaderWatchList: React.Dispatch<React.SetStateAction<MovieType[]>>,
}

const Header = ({ isToggled, setIsToggled, movies, searchValue, setSearchValue, headerWatchList, setHeaderWatchList }: HeaderType) => {
 const [watchList, setWatchList] = useState<MovieType[]>(headerWatchList);

  useEffect(() => {
    setWatchList(headerWatchList);
  }, [headerWatchList]);
  const [recs, setRecs] = useState<RecType[]>([]);
  const [loading, setLoading] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [error, setError] = useState('');
  const savedLastWatchList = localStorage.getItem("lastWatchList");
  const initialLastWatchList = savedLastWatchList ? JSON.parse(savedLastWatchList) : [];
  const [lastWatchList, setLastWatchList] = useState<MovieType[]>(initialLastWatchList);
  const BASE_URL = import.meta.env.VITE_API_URL
  const isTHeWatchListSame = (current: MovieType[], last: MovieType[]) => {
    if (current.length !== last.length) return false;
    for (let i = 0; i < current.length; i++) {
      if (current?.[i]?.id !== last?.[i]?.id) return false;
    }
    return true;
  }
  const isTheSameTrue= isTHeWatchListSame(watchList,lastWatchList);
  const getRecommendations = async () => {
    if (watchList.length === 0) {
      alert("Your watchlist is empty! Add some movies first.");
      return;
    }
    setOverlayOpen(true);
    setRecs([]);
    setError('');
    setLoading(true);

    try {
        if (isTheSameTrue) {
            const savedRecs = localStorage.getItem('recs');
            if (savedRecs) {
                setRecs(JSON.parse(savedRecs));
                setLoading(false);
                return;
            }
        }
      const res = await fetch(`${BASE_URL}/api/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movies: watchList })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setRecs(data.recommendations);

      localStorage.setItem("lastWatchList", JSON.stringify(watchList));
      setLastWatchList(watchList);
      localStorage.setItem('recs', JSON.stringify(data.recommendations));
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const filteredValue = movies.filter(m =>
    m.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const logged = localStorage.getItem("user") !== null;

  return (
    <div className={`header ${isToggled ? "dark" : "light"}`}>
      <div className="header-container">
        <div className='inner-header-container'>
          <input
            className='search-input'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search movies..."
          />
          {searchValue.length > 0 &&
            <div className={`cancel-button ${!isToggled ? "cancel-light-theme" : ""}`}
              onClick={() => setSearchValue('')}>
              <i className="fa-solid fa-xmark-circle"></i>
            </div>
          }
        </div>

        <Link to={logged ? "/watchList" : "/login"} state={{ isToggled }}>
          <button className="search-button watchlist">
            <i className="fa-solid fa-bookmark"></i>
          </button>
        </Link>

        <button className={`ai-recommendation-btn `} onClick={getRecommendations}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          AI picks
        </button>

        <div className={`toggle-theme ${!isToggled ? "not-toggled" : "toggled"}`}
          onClick={() => setIsToggled(prev => !prev)}>
          <div className={`toggle-circle ${isToggled ? "on-state" : "off-state"}`}></div>
        </div>
      </div>

      {/* AI Overlay */}
      {overlayOpen && (
        <div className={`ai-overlay `} onClick={(e) => { if (e.target === e.currentTarget){setOverlayOpen(false)} }}>
          <div className="ai-panel">
            <div className="ai-panel-header">
              <div>
              
              <div className="ai-panel-title">
                <span>Recommended for you</span>
                <span className="ai-label">AI · Gemini</span>
              </div>
              <div className="ai-saved-label">The recommendations are based on your watchlist.</div>
              </div>
              <button className="ai-close-btn" onClick={() => setOverlayOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="ai-panel-body">
              {loading && (
                <div className="ai-thinking">
                  <div className="ai-dots">
                    <div className="ai-dot"></div>
                    <div className="ai-dot"></div>
                    <div className="ai-dot"></div>
                  </div>
                  <span>Analysing your taste...</span>
                </div>
              )}

              {error && !loading && (
                <div className="ai-error">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <p>{error}</p>
                  <button className="ai-retry-btn" onClick={getRecommendations}>Try again</button>
                </div>
              )}

              {!loading && !error && recs.length > 0 && (
                <div className="ai-rec-list">
                  {recs.map((rec, i) => (
                    <div key={rec.title} className="ai-rec-item">
                      <div className="ai-rec-num">{i + 1}</div>
                      <div className="ai-rec-info">
                        <div className="ai-rec-title-row">
                          <span className="ai-rec-title">{rec.title}</span>
                          <span className="ai-rec-year">{rec.year}</span>
                        </div>
                        <span className="ai-rec-genre">{rec.genre}</span>
                        <p className="ai-rec-reason">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {searchValue.length > 0 && (
        <div>
          <div className={`match-not-found ${isToggled ? "no-watch-light-theme" : ""}`}>
            {filteredValue.length === 0 ? "No results found. Try a different search." : ""}
          </div>
          {filteredValue.map((movie) => (
            <Link to="/Details" state={{ tryMovie: movie }} className='search-result' key={movie.id}>
              <div className={`header-title-box ${!isToggled ? "search-list-color" : ""}`}>
                <i className="fa-solid fa-film"></i>
                <div className='search-result-card'>{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Header;