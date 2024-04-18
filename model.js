//It contains schemas and models for all the collections you want to use,
// and then we are exporting all the models created so that they can be imported into the file in which we will get data from different collections.
const mongoose = require('mongoose')

// Course Modal Schema 
const cs3380 = new mongoose.Schema({ 
    _id: Number, 
    courseId: String,
    uvuId: String,
    date: String,
    text: String, 
    id: String 
}); 

const cs4660 = new mongoose.Schema({
    _id: Number, 
    courseId: String,
    uvuId: String,
    date: String,
    text: String, 
    id: String 
})

const cs4690 = new mongoose.Schema({
    _id: Number, 
    courseId: String,
    uvuId: String,
    date: String,
    text: String, 
    id: String 
})

const courses = new mongoose.Schema({
    _id: Number, 
    id: String,
    display: String
})


// Creating model objects 
const CS3380 = mongoose.model('cs3380', cs3380); 
const CS4660 = mongoose.model('cs4660', cs4660); 
const CS4690 = mongoose.model('cs4690', cs4690); 
const COURSES = mongoose.model('courses', courses);

// Exporting our model objects 
module.exports = { 
    CS3380, CS4660, CS4690, COURSES
}
