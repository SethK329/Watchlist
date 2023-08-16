import{render, MovieCard} from "./index.js";

const movieListContainer = document.getElementById("movieListContainer")
let renderArray = JSON.parse(localStorage.getItem("watchlist"))



movieListContainer.addEventListener("click", (e)=>{
    if(e.target.id){
        removeFromWatchlist(e.target.id)
    }
})

function removeFromWatchlist(targetId){
    let targetIndex = renderArray.findIndex(i=>i.imdbID === targetId)
    renderArray.splice(targetIndex,1)
    localStorage.setItem("watchlist", JSON.stringify(renderArray))
    if(renderArray.length>0){
        displayWatchlist()
    }else{
        movieListContainer.innerHTML = `            
        <h3>Your watchlist is looking a little empty...</h3>
        <a href = "index.html">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="#111827"/>
            </svg> Lets add some movies!
        </a>`
    }
}

function displayWatchlist(){
    movieListContainer.innerHTML = ""
    renderArray.forEach((data)=>{
        render(data)
    })
}
if(renderArray.length){
    displayWatchlist()
}