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
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "example.com"],
          "img-src":["self", "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico"]
        },
      },
    })
  );

//serving static files in express is type of middleware that is built in
app.use(express.static('public'))

app.get('/api/v1/courses',(req, res)=> {
    const courses = db.courses
    res.send(courses)
})



app.get('/api/v1/logs',(req,res)=> {
    const courseId = req.query.courseId
    const uvuId = req.query.uvuId
    const logs = db.logs
        .filter(log => log.courseId === courseId)
        .filter(log => log.uvuId === uvuId);

    res.send(logs)
})


app.get('*',(req,res)=>{
    res.sendFile(__dirname +'/public/404.html')
    console.log(__dirname, '/public/404.html')
})

app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})