import './Header.css'
import {useState} from 'react'
import { Link } from 'react-router-dom'
type MovieType={
        id: number;
        title: string;
        poster_path: string;
        release_date: string;
        vote_average: number;
    
}
type HeaderType={
    isToggled:boolean,
    searchValue:string,
    movies:MovieType[],
    setIsToggled:React.Dispatch<React.SetStateAction<boolean>>,
    setSearchValue:React.Dispatch<React.SetStateAction<string>>
}

const Header=({isToggled,setIsToggled,movies,searchValue,setSearchValue}:HeaderType)=>{
      const [watchList, setWatchList] = useState(() => {
  const saved = localStorage.getItem("watchList");
  return saved ? JSON.parse(saved) : []
  });
  const [recs, setRecs] = useState([]);
  const [loading,setLoading]=useState(false);
  const getRecommendations = async () => {
  if(watchList.length===0){
    alert("Your watchlist is empty! Please add some movies to get recommendations.");
    return;
  }
  try{
  setLoading(true);
  alert("Coming Soon! This feature is in development. Please check back later for AI recommendations based on your watchlist.");
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `User's watched movies:\n${watchList.map((m:any) => 
          `- ${m.title}`
        ).join('\n')}\n\nRecommend 5 movies. Return ONLY JSON array:
       [{"title":"...","year":2020,"genre":"...","reason":"..."}]`
      }]
    })
  });

  const data = await res.json();
  const text = data.content[0].text;
  console.log("raw response", text);
  console.log("cleaned response", text.replace(/```json|```/g, '').trim());
  setRecs(JSON.parse(text.replace(/```json|```/g, '').trim()));
  setLoading(false);
}catch(err){
    console.log("error",err);
}finally{
    setLoading(false);
  }
};
    const filteredValue=movies.length>0?movies.filter((movie)=>movie.title.toLowerCase().includes(searchValue.toLowerCase())):[];
    const logged=localStorage.getItem("user")!==null;
    return(
        <div>
        <div className="header-container">
            <div className='inner-header-container'>
                <input className='search-input' 
                    value={searchValue} 
                    onChange={(e)=>setSearchValue(e.target.value)} 
                    type="text"  
                    placeholder="Search Movies"/>
                {searchValue.length>0 &&
                    <div className={`cancel-button ${!isToggled?"cancel-light-theme":""}`}
                    onClick={()=>{setSearchValue('')}}><i className="fa-solid fa-xmark-circle"></i>
                    </div>
                }   
            </div>
            <Link to={logged? "/watchList" : "/login"} 
            state={{ isToggled: isToggled }}>
                <button className="search-button watchlist">
                    <i className="fa-solid fa-bookmark"></i>
                </button>
            </Link>
            <button className="ai-reccomendation" onClick={getRecommendations}>
                <i className="fa-solid fa-thumbs-up"></i>
                Get Ai reccomendations
            </button>
            <div className={`toggle-theme ${!isToggled?"not-toggled":"toggled"}`} onClick={()=>{setIsToggled(prevS=>!prevS)}}>
               <div className={`toggle-circle ${isToggled?"on-state":"off-state"}`}></div> 
            </div> 
            
        </div>
        {(searchValue.length>0 ) &&
         <div>  
               <div className={`match-not-found ${isToggled?"no-watch-light-theme":""}`}>{filteredValue.length===0?"SRY! Match is not found. PLS Try loading more movies":""}</div>
                {filteredValue.map((tryMovie)=>(
                  <Link to="/Details" state={{ tryMovie }} className='search-result'>
                    <div className={`header-title-box ${!isToggled?"search-list-color":""}`}>
                        <div><i className="fa-solid fa-film"></i></div>
                        <div key={tryMovie.id} className='search-result-card'>{tryMovie.title}</div>
                    </div>
                  </Link>   
                ))}
            </div>
        }
        </div>
    )
}
export default Header;