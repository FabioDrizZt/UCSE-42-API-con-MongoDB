const express = require('express')
const app = express()
process.loadEnvFile()
const port = process.env.PORT || 3000
const { connectToMongoDB, disconnectFromMongoDB } = require('./config/mongoDB.js')
const { ObjectId } = require('mongodb')

//Middleware para acceder a la BD y la Collection
app.use(async (req, res, next) => {
    const client = await connectToMongoDB()
    const db = client.db('movies')
    req.movies = await db.collection('movies')
    next()
})
//Middleware para desconectar de MongoDB
app.use((req, res, next) => {
    res.on('finish', async () => {
        await disconnectFromMongoDB()
    })
    next()
})
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de pelis 🎬')
})
app.get('/movies', async (req, res) => {
    const movies = await req.movies.find().toArray()
    res.json(movies)
})
app.get('/movies/:id', async (req, res) => {
    const movie = await req.movies.findOne({ _id: new ObjectId(req.params.id) })
    res.json(movie)
})
app.get('/movies/genre/:genre', async (req, res) => {
    const { genre } = req.params
    const movies = await req.movies.find({ genre: {$in: [genre]} }).toArray()
    res.json(movies)
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})