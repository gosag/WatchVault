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
                    <div className={`cancel-button`}
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
            
            <div className={`toggle-theme ${!isToggled?"not-toggled":"toggled"}`} onClick={()=>{setIsToggled(prevS=>!prevS)}}>
               <div className={`toggle-circle ${isToggled?"on-state":"off-state"}`}></div> 
            </div> 
            
        </div>
        {(searchValue.length>0 ) &&
         <div>  
               <div className={`match-not-found ${isToggled?"no-watch-light-theme":""}`}>{filteredValue.length===0?"SRY! Match is not found. PLS Try loading more data":""}</div>
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