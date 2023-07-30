const searchButton = document.getElementById("searchButton")
const searchInput = document.getElementById("searchInput")
const movieListContainer = document.getElementById("movieListContainer")
let searchResults = []
let movieListArray = []
let watchListArray = []
let currentPage = 1

if(searchButton){
    searchButton.addEventListener("click", searchMovies)

    movieListContainer.addEventListener("click", (e)=>{
        let duplicateCheck = watchListArray.findIndex(i=>i.imdbID ===`w${e.target.id}`)
        console.log(duplicateCheck)
        if(duplicateCheck===-1){
            console.log("not found, gonna add")
            addToWatchList(e.target.id)
        }
    })
}



function searchMovies(){
    const userSearch = searchInput.value
    fetch(`https://www.omdbapi.com/?apikey=eb95c66a&s=${userSearch}&page=${currentPage}`)
    .then(res=>res.json())
    .then(data=>{
        searchResults = data.Search
        movieListArray = []
        movieListContainer.innerHTML = ""
            searchResults.forEach(async (element) => {
              const res = await fetch(`https://www.omdbapi.com/?apikey=eb95c66a&i=${element.imdbID}`)
              const data = await res.json()
              movieListArray.push(data)
              render(data)
            })
        
    })

}

class MovieCard{
    constructor(data){
        Object.assign(this, data)
    }

    getMovieCardHtml() {
        const {imdbID, Poster, Title, imdbRating, Runtime, Genre, Plot} = this
        const plusOrMinus = imdbID.charAt(0) === "w"? "minus-sign": "plus-sign";
        return `<section class = "movie-container">
                    <img src =${Poster}>
                    <div class = "text-container">
                        <div class = "info-container">
                            <h3>${Title}</h3>
                            <img class = "icon" src ="Assets/star-icon.png">
                            <p>${imdbRating}</p>
                        </div>
                        <div class = "info-container">
                            <p>${Runtime}</p>
                            <p>${Genre}</p>
                            <button id =${imdbID} ><img class = "icon" src= "Assets/${plusOrMinus}.png"> Watchlist</button>
                        </div>
                        <p>${Plot}</p>
                    </div>
                </section>`
                
    }
}

function addToWatchList(targetId){
        let movieIndex = movieListArray.find(i=>i.imdbID===targetId)
        movieIndex.imdbID = `w${movieIndex.imdbID}`
        watchListArray.push(movieIndex)
        localStorage.setItem("watchlist", JSON.stringify(watchListArray))
}


function render(data){
        movieListContainer.innerHTML += new MovieCard(data).getMovieCardHtml()
}



export{render, MovieCard, watchListArray}