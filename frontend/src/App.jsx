import React, {useState, useEffect} from 'react';
import Result from './components/Result'

import './app.scss'

const App = (props) => {
    const [movieList, updateMovielist] = useState([])
    const [searchValue, updateSearchValue] = useState("")

    const callSearchApi = () => {
        fetch(`/search?query=${encodeURI(searchValue)}`)
            .then(res => res.json())
            .then(data => updateMovielist(data))
    }

    const deleteResult = async (id) => {
        const response = await fetch(`/favorite/${id}`, {
            method: 'delete'
        })

        const data = await response.json()
        
        // if data result = 1 then it was a successful delete 
        if(data.value === 1) {
            const oldMovieList = [...movieList]
            const movieIndex = oldMovieList.findIndex(element => element.imdbID === id)

            oldMovieList[movieIndex] = {...oldMovieList[movieIndex], ...{id: null, comment: null, rating: null}}
            updateMovielist(oldMovieList)
        }
    }

    const updateResult = async (id, comment, rating) => {
        const response = await fetch(`/favorite/${id}`, {
            method: 'post',
            body: JSON.stringify({
                comment,
                rating
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await response.json()
        
        const oldMovieList = [...movieList]
        const movieIndex = oldMovieList.findIndex(element => element.imdbID === data.id)
        oldMovieList[movieIndex] = {...oldMovieList[movieIndex], ...data}
        updateMovielist(oldMovieList)
    }

    return (
        <div className="App">
            <div className="input-form">
                <label htmlFor="serch">Search for a movie</label>
                <input className="movie-search" id="search" type="text" onChange={(e) => updateSearchValue(e.target.value) }/>
                <button onClick={callSearchApi}>Search</button>
            </div>

            <div className="results">
                {movieList.map((value, index) => (
                    <Result 
                        deleteResult={deleteResult}
                        handleClick={updateResult}
                        key={`aq-image-result-${value.imdbID}`} 
                        result={value} />
                ))}

            </div>
        </div>
    );
}
    
export default App;
