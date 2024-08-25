const express  = require('express')
let logger = require('morgan')
let helmet = require('helmet')
let db = require('./db.json')
const {writeFile} = require('fs-extra')
const bodyParser = require('body-parser')

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

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/api/v1/courses',(req, res)=> {
   
    const courses = db.courses
    res.send(courses)
})

app.get('/api/v1/logs/:uvuId/:courseId',(req,res)=> { //1. filter the student ID and course ID  2. send back the student id with the text and date to the client and 
  const courseId = req.params.courseId
  const uvuId = req.params.uvuId
  const logs = db.logs
  .filter(log => log.courseId === courseId)
  .filter(log => log.uvuId === uvuId)
  .map(log => {return [log.uvuId, log.date, log.text]})

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
    console.log(`Example app listening on port ${port}`)
})


