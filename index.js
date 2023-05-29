const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database")


//Initialise express
const booky = express();

//this is something you need to use whenever you are using post request
//urlencoded({extended: true}) just means that whatever url that is being passed can contain strings, objects...
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


/*
Route            /
Description      Get all the books
Access           Public
Parameter        NONE
Methods          GET
*/

booky.get("/",(req,res) => {
  return res.json({books:database.books});
});


/*
Route            /is
Description      Get specific book on ISBN
Access           Public
Parameter        isbn
Methods          GET
*/

booky.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0) {
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

booky.get("/c/:cat",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.cat)
  )

  if(getSpecificBook.length === 0) {
    return res.json({error:`No book found the category of ${req.params.cat}`})
  }

  return res.json({books:getSpecificBook})
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

booky.get("/au",(req,res) => {
  return res.json({authors:database.author})
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

booky.get("/pb", (req,res) => {
  return res.json({publications: database.publication})
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

booky.post("/book/new", (req, res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks:database.books})
});


/*
Route            /author/new
Description      Add new authors
Access           Public
Parameter        NONE
Methods          POST
*/

booky.post("/au/new", (req, res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthors:database.author})
});

/*
Route            /pb/new
Description      Add new publications
Access           Public
Parameter        NONE
Methods          POST
*/

booky.post("/pb/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
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

booky.listen(3000, () => {
  console.log("Server is up and running");
})
