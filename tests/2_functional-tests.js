/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', done => {
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {


    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test("Test POST /api/books with title", done => {
        chai.request(server)
         .post("/api/books")
         .send({title: "Mamas Cookbook"})
         .end((err, res) => {
           assert.equal(res.status, 200)
           assert.property(res.body, "title", "Books in array should contain title")
           assert.property(res.body, "_id", "Books in array should contain _id")
           done()
         })
      })
      
      test("Test POST /api/books with no title given", done => {
        chai.request(server)
         .post("/api/books")
         .end((err, res) => {
           assert.equal(res.status, 200)
           assert.equal(res.body,"error: No Title specified")
           done()
         })
      })
    })


    suite("GET /api/books => array of books", () => {
      
      test("Test GET /api/books", done => {
        chai.request(server)
         .get("/api/books")
         .end((err, res) => {
           assert.equal(res.status, 200)
           assert.isArray(res.body, "response should be an array")
           assert.property(res.body[0], "title", "Books in array should contain title")
           assert.property(res.body[0], "_id", "Books in array should contain _id")
           assert.property(res.body[0], "commentcount", "Books in array should contain commentcount")          
           done()
         })
      })   
    })


    suite("GET /api/books/[id] => book object with [id]", () => {
      
      test("Test GET /api/books/[id] with id not in db", done => {
        chai.request(server)
         .get("/api/books/5e541f31ac746d343c9dff22")
         .end((err, res) => {
          console.log(res.body)
           assert.equal(res.status, 200)
           assert.equal(res.body,"error: invalid book _id")
           done()
         })
      })
      
      test("Test GET /api/books/[id] with valid id in db", done => {
        chai.request(server)
         .get("/api/books/5e541f31ac746d343c9dff74")
         .end((err, res) => {
           assert.equal(res.status, 200)
           assert.property(res.body[0], "comments", "Books in array should contain comments")
           assert.property(res.body[0], "title", "Books in array should contain title")
           assert.property(res.body[0], "_id", "Books in array should contain _id")
           done()
         })
      })
    })


    suite("POST /api/books/[id] => add comment/expect book object with id", () => {
      
      test("Test POST /api/books/[id] with comment", done => {
        chai.request(server)
         .post("/api/books/5e55a384e836d354be5ff550")
         .send({comment:"awesome!"})
         .end((err, res) => {
           assert.equal(res.status, 200);
           assert.property(res.body, "title", "Books in array should contain title")
           assert.property(res.body, "_id", "Books in array should contain _id")
           assert.property(res.body, "commentcount", "Books in array should contain commentcount")
           done()
         })
      })
    })
  })
})
