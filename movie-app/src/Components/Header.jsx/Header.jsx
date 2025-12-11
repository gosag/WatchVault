import './Header.css'
import {useState} from 'react'

const Header=({watchList,isToggled,setIsToggled})=>{
function AddedTowatch(){
    console.log(watchList)
}
const [searchValue,setSearchValue]=useState('')
function onChangeHandler(event){
    setSearchValue(event.target.value)
}
    return(
        <div className="header-container">
            <div className='inner-header-container'>
            <input className='search-input' value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} type="text"  placeholder="Search Movies"/>
            <button className="search-button"><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <button className="search-button watchlist" onClick={AddedTowatch}>
                <i class="fa-solid fa-bookmark"></i>
            </button>
            <div className={`toggle-theme ${!isToggled?"not-toggled":"toggled"}`} onClick={()=>{setIsToggled(prevS=>!prevS)}}>
               <div className={`toggle-circle ${isToggled?"on-state":"off-state"}`}></div> 
            </div> 
        </div>
    )
}
export default Header;