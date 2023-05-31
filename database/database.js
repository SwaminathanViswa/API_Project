const books = [
  {
    ISBN: "12345Book",
    title: "Tesla!!",
    pubDate: "2023-05-25",
    language: "en",
    numPage: 250,
    author: [1,2],
    publication: [1],
    category: ["tech","space","education"]
  }
]

const author = [
  {
    id:1,
    name:"Viswa",
    books:["12345Book","secretBook"]
  },
  {
    id:2,
    name:"Dinie",
    books:["12345Book"]
  }
]

const publication = [
  {
    id:1,
    name:"writex",
    books:["12345Book"]
  },
  {
    id:2,
    name:"writex2",
    books:[]
  }
]

//this code is written to export the js file to other files
module.exports = {books, author, publication}
