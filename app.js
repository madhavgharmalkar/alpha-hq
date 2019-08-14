require('dotenv').config()

const fetch = require('isomorphic-fetch')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY 

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
})

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


app.get('/search', (req, res) => {
    const searchString = req.query.query
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURI(searchString)}`)
        .then(data => data.json())
        .then((data) => res.json(data.Search))
})

app.get('/details/:id', (req, res) => {
    const movieId = req.params.id
    console.log(movieId)
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`)
        .then(data => data.json())
        .then((data) => res.json(data))
})

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
