const searchButton = document.getElementById("searchButton")
const searchInput = document.getElementById("searchInput")
const movieListContainer = document.getElementById("movieListContainer")
const currentPageEl = document.getElementById("currentPage")
const pageSelectEl = document.getElementById("pageSelect")

const minusSVG = {icon:"remove", 
                  text:"Remove"}

const plusSVG = {icon:"add", 
                 text:"Watchlist"}

let searchResults = []
let movieListArray = []
let watchListArray = JSON.parse(localStorage.getItem("watchlist")) || []
let currentPage = 1
let totalPages = 0

if(searchButton){
    searchButton.addEventListener("click", searchMovies)
    searchInput.addEventListener("keydown", (e)=> {if(e.key ==='Enter'){searchMovies()}})
    
    movieListContainer.addEventListener("click", (e)=>{
        if(movieListArray.length>0 && e.target.id){
            let duplicateCheck = watchListArray.findIndex(i=>i.imdbID ===`w${e.target.id}`)
            if(duplicateCheck===-1){
                addToWatchList(e.target.id)
                addOrRemoveMessage(e.target, "add")
            }else{
                addOrRemoveMessage(e.target, "added")
            }
        }
    })

    pageSelectEl.addEventListener("click", (e)=>{
            pageTurner(e.target.id)
    })
    searchInput.addEventListener("change",searchChangeReset)
}

function pageTurner(targetId){
        if(targetId === "backButton" && currentPage>1){
            currentPage--
            searchMovies()
        }if(targetId=== "forwardButton"){
            currentPage++
            searchMovies()
        }
}

async function searchMovies(){
    const userSearch = searchInput.value
    try{
        const response = await fetch(`https://www.omdbapi.com/?apikey=eb95c66a&s=${userSearch}&page=${currentPage}`)
        const data = await response.json()
        if(data.Response ==='false'){
            throw new Error("Movies not found")
        }else{
            searchResults = data.Search
            totalPages = data.totalResults || 0;
            currentPageEl.innerText = `Page: ${currentPage} of ${Math.ceil(totalPages/10)}`
            movieListArray = []
            movieListContainer.innerHTML = ""
                searchResults.forEach(async (element) => {
                  const res = await fetch(`https://www.omdbapi.com/?apikey=eb95c66a&i=${element.imdbID}`)
                  const data = await res.json()
                  movieListArray.push(data)
                  render(data)
                })
        }
    }catch(error){
        movieListContainer.innerHTML = `
        <div class = "initial-icon" >
            <h3>Unable to find what you're looking for. Please try another search.</h3>
        </div>`
    }
    }

class MovieCard{
    constructor(data){
        Object.assign(this, data)
    }

    getMovieCardHtml() {
        const {imdbID, Poster, Title, imdbRating, Runtime, Genre, Plot} = this
        const plusOrMinus = imdbID.charAt(0) === "w"? minusSVG : plusSVG;
        return `<section class = "movie-container">
                    <img src =${Poster} alt = "Poster of ${Title}">
                    <div class = "text-container">
                        <div class = "info-container">
                            <h3>${Title}</h3>
                            <img class = "icon" src ="Assets/icon.png">
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

function searchChangeReset(){
    currentPage = 1
    movieListContainer.innerHTML = `<div class = "initial-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="62" viewBox="0 0 70 62" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 0C3.91751 0 0 3.9175 0 8.75V52.5C0 57.3325 3.91751 61.25 8.75 61.25H61.25C66.0825 61.25 70 57.3325 70 52.5V8.75C70 3.9175 66.0825 0 61.25 0H8.75ZM21.875 8.75H48.125V26.25H21.875V8.75ZM56.875 43.75V52.5H61.25V43.75H56.875ZM48.125 35H21.875V52.5H48.125V35ZM56.875 35H61.25V26.25H56.875V35ZM61.25 17.5V8.75H56.875V17.5H61.25ZM13.125 8.75V17.5H8.75V8.75H13.125ZM13.125 26.25H8.75V35H13.125V26.25ZM8.75 43.75H13.125V52.5H8.75V43.75Z" fill="#DFDDDD"/>
                                        </svg>
                                        <p>Start exploring</p>
                                    </div>`
    currentPageEl.innerText = "Page: 0 of 0"
    
}

function render(data){
    movieListContainer.innerHTML += new MovieCard(data).getMovieCardHtml()
}



export{render, MovieCard}