require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database")

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//Initialise express
const booky = express();

//this is something you need to use whenever you are using post request
//urlencoded({extended: true}) just means that whatever url that is being passed can contain strings, objects...
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//the env is for security purposes
mongoose.connect(
  process.env.MONGO_URL
).then(() => console.log("Connection Established!"));



/*
Route            /
Description      Get all the books
Access           Public
Parameter        NONE
Methods          GET
*/

booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});


/*
Route            /is
Description      Get specific book on ISBN
Access           Public
Parameter        isbn
Methods          GET
*/

booky.get("/is/:isbn",async (req,res) => {

  const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});

//  const getSpecificBook = database.books.filter(
//    (book) => book.ISBN === req.params.isbn
//  );

// since mongodb doesnt understand the triple equals to, we use the method of null
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  };

  return res.json({book:getSpecificBook})
})


/*
Route            /c
Description      Get specific book on category
Access           Public
Parameter        cat
Methods          GET
*/

booky.get("/c/:cat", async (req,res) => {

  const getSpecificBook = await BookModel.findOne({category:req.params.cat});

  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.cat}`})
  };

  return res.json({book:getSpecificBook})

  // const getSpecificBook = database.books.filter(
  //   (book) => book.category.includes(req.params.cat)
  // )
  //
  // if(getSpecificBook.length === 0) {
  //   return res.json({error:`No book found the category of ${req.params.cat}`})
  // }
  //
  // return res.json({books:getSpecificBook})
});


/*
Route            /l
Description      Get specific book on language
Access           Public
Parameter        lang
Methods          GET
*/

booky.get("/l/:lang", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.lang
  );

  if (getSpecificBook.length === 0) {
    return res.json({error:`No book was found in the language of ${req.params.lang}`})
  }
  return res.json({books: getSpecificBook});
});


/*
Route            /au
Description      Get all the authors
Access           Public
Parameter        NONE
Methods          GET
*/

booky.get("/au",async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});


/*
Route            /au
Description      Get a specific author
Access           Public
Parameter        authors
Methods          GET
*/

booky.get("/au/:authors", (req,res) => {
  const getSpecificAuthors = database.author.filter(
    (author) => author.name === req.params.authors
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({error:`No author was found with the name of ${req.params.authors}`})
  }

  return res.json({author:getSpecificAuthors})
});


/*
Route            /bk
Description      Get a list of authors based on books
Access           Public
Parameter        ibsn
Methods          GET
*/

booky.get("/bk/:ibsn",(req, res) => {
  const getSpecificAuthors = database.author.filter(
    (author) => author.books.includes(req.params.ibsn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({error:`No such authors were found for book with ibsn ${req.params.ibsn}`})
  };

  return res.json({authors: getSpecificAuthors});
});


/*
Route            /pb
Description      Get all the publications
Access           Public
Parameter        NONE
Methods          GET
*/

booky.get("/pb", async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

/*
Route            /pb
Description      Get a specific publication
Access           Public
Parameter        name
Methods          GET
*/

booky.get("/pb/:name", (req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.name === req.params.name
  );

  if (getSpecificPublication.length === 0) {
    return res.json({error:`No such publication of ${req.params.name} was found`})
  }

  return res.json({publications: getSpecificPublication})
});

/*
Route            /pbl
Description      Get a list of publications with book given
Access           Public
Parameter        ibsn
Methods          GET
*/

booky.get("/pbl/:ibsn", (req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.ibsn)
  );

  if (getSpecificPublication.length === 0) {
    return res.json({error:`No such publications exist with the book with ibsn ${req.params.ibsn}`})
  }

  return res.json({publications:getSpecificPublication})
});


//POST METHODS START (to add a new item into the webpage)

/*
Route            /book/new
Description      Add new books
Access           Public
Parameter        NONE
Methods          POST
*/

booky.post("/book/new", async (req, res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message:"Book was added!!"
  });

  // database.books.push(newBook);
  // return res.json({updatedBooks:database.books})
});


/*
Route            /author/new
Description      Add new authors
Access           Public
Parameter        NONE
Methods          POST
*/

booky.post("/au/new", async (req, res) => {
  const {newAuthor} = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json ({
    author: addNewAuthor,
    message: "New Author was added!!"
  });
  // const newAuthor = req.body;
  // database.author.push(newAuthor);
  // return res.json({updatedAuthors:database.author})
});

/*
Route            /pb/new
Description      Add new publications
Access           Public
Parameter        NONE
Methods          POST
*/

booky.post("/pb/new", (req,res) => {
  const {newPublication} = req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    publication: addNewPublication,
    message: "New Publication added!"
  });

  // const newPublication = req.body;
  // database.publication.push(newPublication);
  // return res.json(database.publication);
});

/***********PUT***********/

/*
Route            /pb/update/book
Description      Update or add a new publication
Access           Public
Parameter        isbn
Methods          PUT
*/

booky.put("/pb/update/book/:isbn", (req,res) => {
  //update the publication Database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publication,
    message: "Successfully updated publication"
  });

});

/***********DELETE***********/

/*
Route            /book/delete
Description      Delete a book
Access           Public
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
  //Whichever book that doesnt match with the isbn, just send it to an updatedBookDatabase array
  //and the rest will be filtered out

  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json(database.books);

});

/*
Route            /book/delete/author
Description      Delete a author from book and related book from author
Access           Public
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res)=> {
  //Update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });

  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });
  return res.json({
    book:database.books,
    author:database.author,
    message:"Author was deleted!!"});
});

/*
Route            /book/delete/author
Description      Delete a author from book
Access           Public
Parameter        authorId
Methods          DELETE
*/

booky.delete("/book/delete/au/:authorId", (req,res) => {
  database.books.forEach((book) => {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
  });
  return res.json({books: database.books})
});



booky.listen(3000, () => {
  console.log("Server is up and running");
})
