import './Header.css'
const Header=()=>{
    return(
        <div className="header-container">
            <input className='search-input' type="text" placeholder="Search Movies"/>
            <button className="search-button"><i className="fa-solid fa-magnifying-glass"></i></button>
            <button className="search-button">watch list</button>    
        </div>
    )
}
export default Header;