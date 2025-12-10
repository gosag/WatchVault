import './Header.css'
import {useState} from 'react'
const Header=({watchList})=>{
    function AddedTowatch(){
        console.log(watchList)
    }
const [isToggled,setIsToggled]=useState(false)
    return(
        <div className="header-container">
            <input className='search-input' type="text" placeholder="Search Movies"/>
            <button className="search-button"><i className="fa-solid fa-magnifying-glass"></i></button>
            <button className="search-button" onClick={AddedTowatch}>watch list</button>
            <div className={`toggle-theme ${!isToggled?"not-toggled":"toggled"}`} onClick={()=>{setIsToggled(prevS=>!prevS)}}>
               <div className={`toggle-circle ${isToggled?"on-state":"off-state"}`}></div> 
            </div> 
        </div>
    )
}
export default Header;