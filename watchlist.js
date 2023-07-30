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
        <a href = "index.html"><img class = "icon" src ="Assets/plus-sign.png"/> Lets add some movies!</a>`
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