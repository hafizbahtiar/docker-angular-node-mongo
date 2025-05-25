'use strict'
require('dotenv').config()

// Import packages
const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const PORT = process.env.PORT || 3003
const logger = require('./middlewares/loggerMiddleware')
const mongoose = require('mongoose')

app.use(express.json())
app.use(cookieparser())
app.use(bodyparser.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }))

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/myappangular'

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error('MongoDB connection error:', err)
        process.exit(1)
    })

// ================================================================================
// ------------------------------- Start Static Folder ----------------------------
// ================================================================================

// This configuration allows your Express.js server to serve static files from the
// src/uploads directory. For example, if you have an image file located
// at src/uploads/image.jpg, it can be accessed via http://yourserver/uploads/image.jpg.

app.use('/uploads', express.static(path.join(__dirname, '..', 'src', 'uploads')))

// ================================================================================
// -------------------------------- End Static Folder -----------------------------
// ================================================================================

app.use(logger)
app.use(
    cors({
        origin: `http://localhost:${PORT}`, // Allow requests from this origin
        methods: ['GET', 'POST'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers for requests
    })
)

// ================================================================================
// --------------------------------- Start API Route ------------------------------
// ================================================================================

// const testingRoute = require(`./routes/testingRoute`)
// const keysRoute = require(`./routes/keysRoute`)
// const privilegesRoute = require(`./routes/privilegesRoute`)
// const usersRoute = require(`./routes/usersRoute`)

// app.use(`/api/testing`, testingRoute)
// app.use(`/api/keys`, keysRoute)
// app.use(`/api/privileges`, privilegesRoute)
// app.use(`/api/users`, usersRoute)

// ================================================================================
// --------------------------------- End API Route ------------------------------
// ================================================================================

app.get('/', async (req, res) => {
    return res.status(200).json({ message: 'Hello World!' })
})

app.listen(PORT, async () => {
    console.log(`Server listening ${process.pid} at port ${PORT}`)
})
