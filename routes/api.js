/*
*
*
*       Complete the API routing below
*       
*       
*/

"use strict"

const expect = require("chai").expect
const mongoose = require("mongoose")
const MongoClient = require("mongodb")
 const ObjectId = require("mongodb").ObjectId

const {Book, Comment} = require("../models")

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route("/api/books")
    .get((req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const getBooks = async () => {
        let books = await Book.find({})        
        
        // Mongoose .find() does not return a JSON obj !! dot notation will not work without converting to JSON first          
        let newbooks = books.map(book => JSON.parse(JSON.stringify(book)))            

        Promise.all(newbooks.map(async newbook => {
          newbook.commentcount = await Comment.countDocuments({bookid: newbook._id})
          return newbook
        })).then(data => res.json(data))
      }
             
      getBooks() 
    })    
    
            
    .post((req, res) => {
      const title = req.body.title
      
      if(title === undefined)
        return res.json("error: No Title specified")        
      //response will contain new book object including atleast _id and title
      Book.findOne({title: title}).then(data => {
        if (data === null) {
          const newBook = new Book({title: title})
          newBook.save().then(data => res.json(data)).catch((err) => res.json({error: err}))
        }
      })      
    })
    
  
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {if(err) res.json(err)})
      Comment.deleteMany({}, (err, data) => {if(err) res.json(err)})
      res.json("complete delete successful")
    })



  app.route("/api/books/:id")
    .get((req, res) => {
      const id = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.aggregate([
        {$match: {"_id": ObjectId(id)}},
        {$lookup: {
          localField: "_id",
          from: "comments",
          foreignField: "bookid",
          as: "comments"}}
      ])
      .exec((err, results) => {
        JSON.parse(JSON.stringify(results))
        if (Object.keys(results).length === 0)
          res.json("error: invalid book _id")        
        else
          res.json(results) 
      })
    })

  
    .post((req, res) => {
      const bookid = req.params.id
      const comment = req.body.comment
      //json res format same as .get
      const newComment = new Comment({bookid: bookid, text: comment})
      newComment.save().then(data => {
         getBook() 
      }).catch((err) => res.json({error: err}))
        
      const getBook = async () => {
        let book = await Book.findOne({_id: bookid})        
        
        // Mongoose .find() does not return a JSON obj !! dot notation will not work without converting to JSON first          
        let newbook = JSON.parse(JSON.stringify(book))            
        newbook.commentcount = await Comment.countDocuments({bookid: newbook._id})

        res.json(newbook)
      }
    })
  
  
    .delete((req, res) => {
      const bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({_id: bookid}, (err, data) => {if(err) res.json(err)})
      Comment.deleteMany({bookid: bookid}, (err, data) => {if(err) res.json(err)})
      res.json("delete successful")    
    })
  
}
