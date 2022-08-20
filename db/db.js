require('dotenv').config()

// Mongoose connection
var mongoose = require('mongoose')

var mongoDB = process.env.DB_CONNECTION || dev_db_url

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

mongoose.connection.readyState === 2 ? console.log('MongoDB connected') : ''
