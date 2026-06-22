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
  const sampleData: RecType[] = [
  {
    title: 'Mission: Impossible - Fallout',
    year: 2018,
    genre: 'Action, Thriller',
    reason: "You enjoyed the high-octane, practical action and blockbuster thrill of 'Top Gun: Maverick,' and 'Mission: Impossible - Fallout' delivers similar adrenaline-pumping sequences, incredible stunts, and a relentless pace, making it one of the genre's best."
  },
  {
    title: 'Mad Max: Fury Road',
    year: 2015,
    genre: 'Action, Sci-Fi',
    reason: "With its non-stop, visually stunning action and unique post-apocalyptic setting, 'Mad Max: Fury Road' offers the intense, fantastical spectacle you appreciated in 'Mortal Kombat II' and the relentless, high-stakes excitement of 'Top Gun: Maverick'."
  },
  {
    title: 'John Wick',
    year: 2014,
    genre: 'Action, Thriller',
    reason: "Given your enjoyment of the choreographed combat in 'Mortal Kombat II,' 'John Wick' provides a masterclass in stylish, well-executed martial arts and gun-fu action, creating a compelling and highly rewatchable thrill ride."
  },
  {
    title: 'Dredd',
    year: 2012,
    genre: 'Action, Sci-Fi',
    reason: "For fans of the grittier, sci-fi tinged action found in 'Mortal Kombat II,' 'Dredd' delivers a relentless and intense experience with impactful violence, a unique dystopian setting, and a no-nonsense approach to its action sequences."
  },
  {
    title: 'Edge of Tomorrow',
    year: 2014,
    genre: 'Action, Sci-Fi',
    reason: "This film blends high-concept sci-fi with intense action, offering a gripping story and compelling combat. Its unique time-loop premise ensures constant high stakes and exciting sequences, appealing to your enjoyment of both 'Mortal Kombat II's sci-fi elements and 'Top Gun: Maverick's blockbuster thrills."
  }
];
  const [recs, setRecs] = useState<RecType[]>([]);
  const [loading, setLoading] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = import.meta.env.VITE_URL || 'http://localhost:3001';

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
      /* const res = await fetch(`${BASE_URL}/api/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movies: watchList })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      setRecs(data.recommendations); */
      setRecs(sampleData);
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
        <div className={`ai-overlay `} onClick={(e) => { if (e.target === e.currentTarget) setOverlayOpen(false) }}>
          <div className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-title">
                <span>Recommended for you</span>
                <span className="ai-label">AI · Gemini</span>
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