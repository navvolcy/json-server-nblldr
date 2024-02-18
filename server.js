const express  = require('express')
let logger = require('morgan')
let helmet = require('helmet')
let db = require('./db.json')
const app = express()
const port = 3000

//Middleware functions are functions that have access to the request object (req), 
//the response object (res), and the next middleware function in the application’s request-response cycle. 
//The next middleware function is commonly denoted by a variable named next.

app.use(logger('dev'))
app.use(helmet())

//serving static files in express is type of middleware to serve 
app.use(express.static('public'))

app.get('/',(req, res)=>{
    res.send('Hello world!')
})
app.get('*',(req,res)=>{
    res.sendFile(__dirname +'/public/404.html')
    console.log(__dirname, '/public/404.html')
})

app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})