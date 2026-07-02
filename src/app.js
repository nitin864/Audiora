const express = require('express')
const cookieParser = require('cookie-parser');
const 

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", )
module.exports = app