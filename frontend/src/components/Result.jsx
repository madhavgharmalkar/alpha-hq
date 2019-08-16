import React, {useState, useEffect} from 'react'
import Rating from 'react-rating'
import {FaStar, FaRegStar} from 'react-icons/fa'

import './result.scss'

const Result = (props) => {
    const value = props.result
    const [comment, updateComment] = useState(value.comment || "")

    const updateResult = (id, comment, rating) => {
        props.handleClick(id, comment, rating)
    }

    return (
        <div className="result">
            <div className="img-container">
                <img src={value.Poster} alt=""/>
            </div>
            <div className="info">
                <div className="meta">
                    <div className="title">
                        {value.Title}
                    </div>
                    <div>[Year] {value.Year}</div>
                    <div>{value.Plot}</div>
                    <hr/>
                </div>
                {value.id && 
                    <div className="meta-data">
                        <Rating
                            onChange={(number) => updateResult(value.id, comment, number)}
                            initialRating={value.rating}
                            emptySymbol={<FaRegStar/>}
                            fullSymbol={<FaStar/>}
                        />
                        <div className="comments">
                            <input type="text" value={comment} onChange={e => updateComment(e.target.value)}/>
                            <input type="button" value="Save comment" onClick={() => updateResult(value.imdbID, comment, value.rating)}/>
                        </div>
                    </div>
                   
                }
                <FaStar 
                    onClick={() => value.id ? props.deleteResult(value.id) : updateResult(value.imdbID)}
                    className={value.id ? "fav-star active" : 'fav-star'}
                />
            </div>
        </div>
    )
}

export default Result