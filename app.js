require('dotenv').config()

const fetch = require('isomorphic-fetch')

const express = require('express')
const path = require('path');
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

const Favorite = sequelize.define('favorite', {
    id: {
        type: Sequelize.TEXT,
        primaryKey: true
    },
    rating: Sequelize.INTEGER,
    comment: Sequelize.TEXT
})

Favorite.sync()

const querySearchString = async (searchString) => {
    let responseData = []

    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURI(searchString)}`)
    const data = await response.json()

    if (!!data.Search) {
        const detailsPromiseArray = data.Search.map(value => fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${value.imdbID}`).then(res => res.json()))
        const dataWithDetails = await Promise.all(detailsPromiseArray)

        // now that we have an array of movie titles we want to check against our databse to see if we fav'ed them or not
        const movieIds = dataWithDetails.map(value => value.imdbID)
        const dbResult = await Favorite.findAll({
            where: {
                id: movieIds
            }
        })
        
        const moviesInDb = dbResult.map(value => value.dataValues)
        const dataWithFav = dataWithDetails.map((value) => ({
            ...moviesInDb.find(item => item.id === value.imdbID),
            ...value
        }))

        responseData = dataWithFav
    }

    return responseData
}

app.use(express.json())
app.get('/search', (req, res) => {
    const searchString = req.query.query
    querySearchString(searchString)
        .then(value => res.json(value))
})

app.post('/favorite/:id', (req, res) => {
    const id = req.params.id
    const {
        rating,
        comment
    } = req.body

    Favorite.upsert({ id, rating, comment}, {
        returning: true
    }).then(([record]) => res.json(record))
})

app.delete('/favorite/:id', (req, res) => {
    const id = req.params.id

    Favorite.destroy({
        where: {
            id
        }
    }).then((value) => res.json({value}))
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'))
    })
}

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
