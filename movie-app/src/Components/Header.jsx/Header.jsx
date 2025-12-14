import './Header.css'
import {useState} from 'react'
import { Link } from 'react-router-dom'
const Header=({isToggled,setIsToggled,movies,searchValue,setSearchValue})=>{
    const filteredValue=movies.length>0?movies.filter((movie)=>movie.title.toLowerCase().includes(searchValue.toLowerCase())):["Movies Loading..."]
    return(
        <div>
        <div className="header-container">
            <div className='inner-header-container'>
            <input className='search-input' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} type="text"  placeholder="Search Movies"/>
            {/* <button className="search-button"><i className="fa-solid fa-magnifying-glass"></i></button> */}
            </div>
            <Link to={"/watchList"}>
                <button className="search-button watchlist">
                    <i className="fa-solid fa-bookmark"></i>
                </button>
            </Link>
            
            <div className={`toggle-theme ${!isToggled?"not-toggled":"toggled"}`} onClick={()=>{setIsToggled(prevS=>!prevS)}}>
               <div className={`toggle-circle ${isToggled?"on-state":"off-state"}`}></div> 
            </div> 
            
        </div>
        {searchValue.length>0 &&
         <div>
                {filteredValue.map((tryMovie)=>(
                  <Link to="/Details" state={{ tryMovie }} className='search-result'>
                    <div className='header-title-box'>
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