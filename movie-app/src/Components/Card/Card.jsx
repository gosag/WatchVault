const Card=()=>{
const tryMovie=[
    {
      adult: false,
      backdrop_path: "/sT1WD9FLDhox4jzANtaL3svMNXF.jpg",
      genre_ids: [],
      id: 568593,
      original_language: "en",
      original_title: "Man",
      overview: "Maggie and her sister form an unusual bond during an encounter with a young man.",
      popularity: 3.0962,
      poster_path: "/duvsME7fNGutR2SPm1lZqXls9zY.jpg",
      release_date: "2008-01-22",
      title: "Man",
      video: false,
      vote_average: 7.1,
      vote_count: 23
    }
]
    return(
        <div className="card">
            {tryMovie.map((movie)=>(
                <div>{movie.release_date}<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} /></div>
            ))}
        </div>
    )
}
export default Card;