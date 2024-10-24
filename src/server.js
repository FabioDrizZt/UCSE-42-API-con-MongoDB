const express = require('express')
const app = express()
process.loadEnvFile()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hoal mundo!')
})

app.listen(port, () => {
    console.log(`Example app listening on http://192.168.210.62:${port}`)
})