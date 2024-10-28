const express = require('express')
const app = express()
process.loadEnvFile()
const port = process.env.PORT || 3000
const { connectToMongoDB, disconnectFromMongoDB } = require('./config/mongoDB.js')
const { ObjectId, ReturnDocument } = require('mongodb')

// Middleware para parsear JSON
app.use(express.json())
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
    if (!movie)
        res.status(404).send('No se encontro la pelicula')
    else 
        res.json(movie)
})
app.get('/movies/genre/:genre', async (req, res) => {
    const { genre } = req.params
    const movies = await req.movies.find({ genre: {$in: [genre]} }).toArray()
    res.json(movies)
})

// Agregar una pelicula
app.post('/movies/', async (req,res) => {
    const nuevaPeli = req.body
    if (nuevaPeli === undefined)
        res.status(400).send('Error en el formato de la peli')
    try {
        await req.movies.insertOne(nuevaPeli)
        res.status(201).send(nuevaPeli)
    } catch (error) {
        res.status(500).send('Error al agregar pelicula')
    }
})

// modificar una pelicula
app.put('/movies/:id', async (req,res) => {
    const datosPeli = req.body
    const id = new ObjectId(req.params.id)

    if (!datosPeli)
        res.status(400).send('Error en el formato de los nuevos datos de la peli')

    try {
        peliActualizada = await req.movies.findOneAndUpdate(
            {_id:id}, 
            {$set: datosPeli},
            {ReturnDocument: 'after'}
        )
        if (!peliActualizada)
            res.status(404).send('Error al encontrar la pelicula a actualizar')
        else 
            res.status(201).send(peliActualizada)
    } catch (error) {
        res.status(500).send('Error al agregar pelicula')
    }
})

app.delete('/movies/:id', async (req, res) => {
    try {
        const resultado = await req.movies.deleteOne({ _id: new ObjectId(req.params.id) })
        if (resultado.deletedCount > 0){
            res.status(204).send('Pelicula borrada exitosamente')
        }else {
            res.status(404).send('No se encontro la pelicula a borrar')
        }
    } catch (error) {
        res.status(500).send('Error al agregar pelicula')
    }

})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})