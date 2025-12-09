import './Header.css'
const Header=({watchList})=>{
    function AddedTowatch(){
        console.log(watchList)
    }
    return(
        <div className="header-container">
            <input className='search-input' type="text" placeholder="Search Movies"/>
            <button className="search-button"><i className="fa-solid fa-magnifying-glass"></i></button>
            <button className="search-button" onClick={AddedTowatch}>watch list</button>    
        </div>
    )
}
export default Header;