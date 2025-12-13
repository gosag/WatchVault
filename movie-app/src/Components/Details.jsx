import { useLocation } from "react-router-dom";
function Details(){
  const {tryMovie,isToggled} = useLocation().state;
  const movie={
    adult: false,
    backdrop_path: '/min9ZUDZbiguTiQ7yz1Hbqk78HT.jpg',
    genre_ids: [ 878, 12, 28 ],
    id: 533533,
    original_language: 'en',
    original_title: 'TRON: Ares',
    overview: 
    'A highly sophisticated Program called Ares is sent from the digital world into the real world on a dangerous mission, marking humankind\'s first encounter with A.I. beings.',
    popularity: 279.2534,
    poster_path: '/chpWmskl3aKm1aTZqUHRCtviwPy.jpg',
    release_date: '2025-10-08',
    title: 'TRON: Ares',
    video: false,
    vote_average: 6.551,
    vote_count: 695
  }
    return(
        <div>
           {isToggled?<p>toggled</p>:""}
           <img className='movie-back-drop' src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={tryMovie.title} /> 
        </div>
    )
}
export default Details;
