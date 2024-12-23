const express = require('express')
const router = require('./route')
require('dotenv').config()
const path = require('path')
const cors = require('cors')


const port = process.env.PORT
const app = express()

app.use(cors({
    origin: 'http://46.229.209.30:3000', // Разрешить запросы только с вашего React-приложения
    methods: ['GET', 'POST', 'OPTIONS'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
}));
app.use(express.json())
app.use(router)


app.use(express.static(path.join('__dirname', 'client/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join('__dirname', 'client/build', 'index.html'))
})
app.listen(port, () => console.log(`сервер запущен на ${port}`))