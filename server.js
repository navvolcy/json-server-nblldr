 const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
// let db = require("./db.json");
const { CS3380, CS4660, COURSES, LOGS } = require("./model");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { filter } = require("ldapjs");
const { ur } = require("@faker-js/faker");
const uri = "mongodb+srv://navvolcy:21296Vpu01@cluster0.0h4wite.mongodb.net/uvu_classes?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
const port = 3000;
//import chalk from 'chalk';
//Middleware functions are functions that have access to the request object (req),
//the response object (res), and the next middleware function in the application’s request-response cycle.
//The next middleware function is commonly denoted by a variable named next.

app.use(logger("dev"));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "example.com"],
        "img-src": null,
      },
    },
  })
);

//serving static files
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
let mongodb;


//empty Array to store docs from mongodb collections
let dbcourses = [];
let courses = [];
async function main() {
  mongodb = await mongoose.connect(uri);
  
  console.log("Pinged your deployment. You successfully connected to MongoDB!", );
  console.log("connected");
}  

//connecting to db
//query db
  main()
  .then(() => {
    LOGS.find({})
      .exec()
      .then((data) => {
        data.map((course, k) => {
          dbcourses.push(course);
        })
        console.log("array: ", dbcourses);
      })

    COURSES.find({})
      .exec()
      .then((data) => {
        data.map((display) => {
          courses.push(display);
        });
        console.log("array2: ", courses);
      });  
  })
  .catch((err) => console.log("not connected", err));

//setting up endpoints
//get multiple collections
app.get('/api/v1/courses', (req, res) => {
console.log("new", courses)
  res.send(courses)
});
//aggreagate multiple documents from three different collections
app.get("/api/v1/logs/:uvuId/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  const uvuId = req.params.uvuId;
  const logs = dbcourses
        .filter(log => log.courseId === courseId)
        .filter(log => log.uvuId === uvuId)
        .map(function (log) {
          return [log.uvuId, log.date, log.text]})
        console.log(logs)

  res.send(logs);
});


//add new courses is the Courses
app.post("/api/v1/courses", async(req, res) => {

  try{
    const client = new MongoClient(uri);
    await client.connect()

    const db = client.db("uvu_classes")
    const collection = db.collection("courses")

    const {display} = req.body;
    if (!display){
      console.log("display: ", display)
    }

    const result = await collection.insertOne({display});
    console.log( "reached backend");

    
    res.send(result)
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Error inserting data'});
  }

});


app.post("/api/v1/logs",async (req, res) => {
  try{
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("uvu_classes")
    const collection = db.collection("logs")

    const updatedLogs = req.body;
    //updatedLogs.push(req.body);

    const result = await collection.insertOne(updatedLogs)

    res.status(201).json({ message: 'Data inserted successfully', insertedId: result.insertedId })
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Error inserting data'});
  }
  
  
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/404.html");
  console.log(__dirname, "/public/404.html");
});

app.listen(port, () => {
  // console.log(`Listening  on ${chalk.blue(`http://${ip}:${port}`)}`)
});

function gracefulShutdown(signal) {
  //save db to disk
  console.log(`\n${signal} signal received: closing HTTP server`);
  Server.close(() => {
    console.log("HTTP server is closed");
  });
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGUP", gracefulShutdown);
process.on("SIGBREAK", gracefulShutdown);
