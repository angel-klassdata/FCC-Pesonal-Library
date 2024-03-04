/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookModel = require("../models").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await BookModel.find();
        res.json(books);
      } catch (err) {
        res.json({ error: "could not find books" });
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including at least _id and title
      if (!title) {
        res.send('missing required field title');
        return;
      }
      let bookModel = new BookModel({ title: title, commentcount: 0 });
      try {
        bookModel = await bookModel.save(); 
        res.json(bookModel);
      } catch (err) {
        //console.log(err)
        res.json({ error: "could not post book", title: title });
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        await BookModel.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        //console.log(err)
        res.json({ error: "could not delete books" });
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await BookModel.findById({ _id: bookid });
        if (!book) {
          res.send('no book exists');
          return;
        }
        res.json(book);
      } catch (err) {
        //console.log(err)
        res.send('no book exists');
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!bookid) {
        res.send('missing book id');
        return;
      }
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      try {
        let book = await BookModel.findById({ _id: bookid });
        if (!book) {
          res.send('no book exists');
          return;
        } else {
          let update = { $push: { comments: comment }, $inc : { 'commentcount': 1 } };
          const newComment = await BookModel.findByIdAndUpdate(bookid, update, { returnDocument: 'after' }); 
          res.json(newComment);
        }
      } catch (err) {
        //console.log(err)
        res.send('no book exists');
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      //if (!tryDelete) throw new Error('no book exists');
      try {
        let book = await BookModel.findById({ _id: bookid });
        if (!book) {
          res.send('no book exists');
          return;
        } else {
          await BookModel.findByIdAndDelete(bookid);
          //console.log(tryDelete);
          res.send('delete successful');
        }
      } catch (err) {
        //console.log(err)
        res.send('no book exists');
      }
    });
  
};
