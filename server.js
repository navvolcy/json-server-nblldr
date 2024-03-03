const express  = require('express')
const logger = require('morgan')
const helmet = require('helmet')
let db = require('./db.json')
const {writeFile} = require('fs')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
//import chalk from 'chalk';




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

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//setting up endpoints
app.get('/api/v1/courses',(req, res)=> {
   
    const courses = db.courses
    res.send(courses)
})

app.get('/api/v1/logs/:uvuId/:courseId',(req,res)=> {
    const courseId = req.params.courseId
    const uvuId = req.params.uvuId
    const logs = db.logs
        .filter(log => log.courseId === courseId)
        .filter(log => log.uvuId === uvuId)
        .map(function (log) {
          return [log.uvuId, log.date, log.text]})
          console.log(uvuId)

    console.log(logs ,'here1')

    res.send(logs)
})


 app.post('/api/v1/logs',(req,res)=>{

  let updatedLogs = db.logs
  updatedLogs.push(req.body)
  writeFile('./db.json', JSON.stringify({...db,logs:updatedLogs}, null, 2), (error) => {
    
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  });
  
  
  console.log('post /api/vi/logs', db.logs) 

  
})

app.get('*',(req,res)=>{
  res.sendFile(__dirname +'/public/404.html')
  console.log(__dirname, '/public/404.html')
})

app.listen(port, () =>{
   // console.log(`Listening  on ${chalk.blue(`http://${ip}:${port}`)}`)
})

function gracefulShutdown(signal){
  //save db to disk
  console.log(`\n${signal} signal received: closing HTTP server`)
  Server.close(()=>{
    console.log('HTTP server is closed')
  });
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGUP', gracefulShutdown)
process.on('SIGBREAK', gracefulShutdown)