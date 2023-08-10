const searchButton = document.getElementById("searchButton")
const searchInput = document.getElementById("searchInput")
const movieListContainer = document.getElementById("movieListContainer")
const minusSVG = {icon:"remove", 
                  text:"Remove"}
const plusSVG = {icon:"add", 
                 text:"Watchlist"}
let searchResults = []
let movieListArray = []
let watchListArray = []
let currentPage = 1

if(searchButton){
    searchButton.addEventListener("click", searchMovies)

    movieListContainer.addEventListener("click", (e)=>{
        if(movieListArray.length>0){
            let duplicateCheck = watchListArray.findIndex(i=>i.imdbID ===`w${e.target.id}`)
            if(duplicateCheck===-1){
                addToWatchList(e.target.id)
                addOrRemoveMessage(e.target, "add")
            }else{
                addOrRemoveMessage(e.target, "added")
            }
        }
    })
}



async function searchMovies(){
    const userSearch = searchInput.value
    const response = await fetch(`https://www.omdbapi.com/?apikey=eb95c66a&s=${userSearch}&page=${currentPage}`)
    const data = await response.json()
        searchResults = data.Search
        movieListArray = []
        movieListContainer.innerHTML = ""
            searchResults.forEach(async (element) => {
              const res = await fetch(`https://www.omdbapi.com/?apikey=eb95c66a&i=${element.imdbID}`)
              const data = await res.json()
              movieListArray.push(data)
              render(data)
            })
        
    }

class MovieCard{
    constructor(data){
        Object.assign(this, data)
    }

    getMovieCardHtml() {
        const {imdbID, Poster, Title, imdbRating, Runtime, Genre, Plot} = this
        const plusOrMinus = imdbID.charAt(0) === "w"? minusSVG : plusSVG;
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
                            <button id =${imdbID} class="${plusOrMinus.icon}">${plusOrMinus.text}</button>
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

function addOrRemoveMessage(target, state){
    let copyMessage = document.createElement("span")
    target.parentNode.appendChild(copyMessage)
    const messageText = state === "add"? "Added to Watchlist!": state === "added"?"Already in Watchlist":"Removed from Watchlist";
    copyMessage.innerText = messageText
    setTimeout(()=>{
        target.parentNode.removeChild(copyMessage)
    }, 1500)
}

function render(data){
        movieListContainer.innerHTML += new MovieCard(data).getMovieCardHtml()
}



export{render, MovieCard}