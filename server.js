const express  = require('express')
let logger = require('morgan')
let helmet = require('helmet')
let db = require('./db.json')
const app = express()
const port = 3000
//import chalk from 'chalk';
const { networkInterfaces } = require('os');

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

//serving static files 
app.use(express.static('public'))
//setting up endpoints
app.get('/api/v1/courses',(req, res)=> {
    const courses = db.courses
    res.send(courses)
})


app.get('/api/v1/logs/:uvuId/:courseId',(req,res)=> {
     const uvuId = req.params.uvuId
     const courseId = req.params.courseId
     const logs = db.logs
        .filter(log => log.courseId === courseId)
        .filter(log => log.uvuId === uvuId)
        .map(log => [log.uvuId, log.date, log.text])


       

        console.log(courseId,'course')
        console.log(uvuId,"ID")
        console.log(logs,"logs")


    res.send(logs)
})


app.get('*',(req,res)=>{
    res.sendFile(__dirname +'/public/404.html')
    console.log(__dirname, '/public/404.html')
})

app.post('/api/vi/logs',(req,res)=>{
    

    
    res.send(db.logs)
})
app.listen(port, () =>{
   // console.log(`Listening  on ${chalk.blue(`http://${ip}:${port}`)}`)
})
function gracefulShutdown(signal) {
    //save db to disk 
    console.log(`\n${signal} signal received: closing HTTP server`)
    Server.close(()=>{
        console.log('HTTP server is closed')
    });
}

process.on('SIGHUP', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGBREAK', gracefulShutdown)

