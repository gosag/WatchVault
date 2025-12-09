import './Card.css'
import {useState,useEffect} from 'react'
const Card=({tryMovie,watchList,setWatchList})=>{
const Movie=
    {
      adult: false,
      backdrop_path: "/sT1WD9FLDhox4jzANtaL3svMNXF.jpg",
      genre_ids: [],
      id: 568593,
      original_language: "en",
      original_title: "Man",
      overview: "Maggie and her sister form an unusual bond during an encounter with a young man.",
      popularity: 3.0962,
      poster_path: "/fOfFksPHhWiRKOoYEIQFhT4RJ2d.jpg",
      release_date: "2008-01-22",
      title: "Man",
      video: false,
      vote_average: 7.1,
      vote_count: 23
    }
const [ratingValue,setRatingValue]=useState('rating-0.png')

function ChangeVoteAverage() {
    const Vote = tryMovie.vote_average;

    if (Vote < 1) {
        setRatingValue('rating-0.png');
    }
    else if (Vote < 2) {
        setRatingValue('rating-05.png');
    }
    else if (Vote < 3) {
        setRatingValue('rating-10.png');
    }
    else if (Vote < 4) {
        setRatingValue('rating-15.png');
    }
    else if (Vote < 5) {
        setRatingValue('rating-20.png');
    }
    else if (Vote < 6) {
        setRatingValue('rating-25.png');
    }
    else if (Vote < 7) {
        setRatingValue('rating-30.png');
    }
    else if (Vote < 8) {
        setRatingValue('rating-35.png');
    }
    else if (Vote < 9) {
        setRatingValue('rating-40.png');
    }
    else if (Vote < 10) {
        setRatingValue('rating-45.png');
    }
    else {
        setRatingValue('rating-50.png');
    }
}


useEffect(()=>{
    ChangeVoteAverage();
},[tryMovie])
  const [tempWatch,setTempwatch]=useState(null);
const matchFound=watchList.find((item)=>item.id===tryMovie.id)
function AddToWatchList(){
    console.log('added to watch list',tryMovie.id);
    
    setTempwatch(tryMovie);
    setIsFavourite(preS=>!preS)
}
useEffect(()=>{
    if (!tempWatch) return;
    try{
    if(!matchFound){
        setWatchList((prevState)=>[...prevState,tempWatch]);
    }
     
    }catch(error){
        console.log('caught error:',error);
    }
    return ()=>{console.log("cleanup")};
},[tempWatch])
const [isFavorite,setIsFavourite]=useState(false);
    return(
        <div className="card">
                <div className='inner-card-container'>
                  <div className='image-wrap'>
                    <img className='movie-poster blur' src={`https://image.tmdb.org/t/p/w500${tryMovie.poster_path}`} alt={tryMovie.title} />
                    <img className='movie-poster main' src={`https://image.tmdb.org/t/p/w500${tryMovie.poster_path}`} alt={tryMovie.title} />
                  </div>
                  <div className='movie-title'>
                             {tryMovie.title}
                  </div>
                  <div className='movie-info'>
                        
                        
                  <div className="vote-average"> <img className='star-image' src={`../../../ratings/${ratingValue}`}/></div>
                  
                  </div>
                  <button className="full-details">Details</button>
                  <div className={`fav-container ${isFavorite?"is-favourite":''}`} onClick={AddToWatchList} >
                     <i className="fa-solid fa-heart"></i>
                  </div>
                </div>
                
        </div>
    )
}
export default Card;