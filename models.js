const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String, 
    trim: true,
    min: 1,
    max: 100
  }
})


const commentSchema = new mongoose.Schema({
  bookid: {
    type: mongoose.Schema.Types.ObjectId
  },
  text: {
    required: true,
    type: String, 
    trim: true,
    min: 1,
    max:500
  }  
})

const Book = mongoose.model("book", bookSchema)
const Comment = mongoose.model("comment", commentSchema)

module.exports = {Book, Comment}