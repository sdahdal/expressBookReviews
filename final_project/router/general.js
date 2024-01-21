const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require('axios');
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  //Write your code here
  let { username, password } = req.body;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  res.json(JSON.stringify(books));
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.json(books[isbn]);
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book;
  Object.keys(books).forEach(function (key) {
    if (books[key].author === author)
      book = books[key];
  });
  res.json(book);
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let book;
  let title = req.params.title;
  Object.keys(books).forEach((key) => {
    if (books[key].title === title)
      book = books[key]
  });
  res.json(book);
  // return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  res.json(books[req.params.isbn].reviews);
  // return res.status(300).json({ message: "Yet to be implemented" });
});

const doesExist = (username) => {
  let filtered = users.filter((user) => {
    return user.username === username
  });
  return filtered.length > 0 ? true : false;
}

const getAllBooks = () => {
  let myPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books))
  });
  myPromise.then(res => console.log(res));
}

const getBookByisbn = (isbn) => {
  let myPromise = new Promise((resolve, reject) => {
    resolve(() => {
      return books[isbn];
    })
  });
  myPromise.then(res => console.log(res()));
}

const getBookByAuthor = (author) => {
  let myPromise = new Promise((resolve, reject) => {
    resolve(() => {
      let book;
      Object.keys(books).forEach(function (key) {
        if (books[key].author === author)
          book = books[key];
      });
      return book;
    })
  });
  myPromise.then(res => console.log(res()));
}

const getBookByTitle = (title) => {
  let myPromise = new Promise((resolve, reject) => {
    resolve(() => {
      let book;
      Object.keys(books).forEach((key) => {
        if (books[key].title === title)
          book = books[key]
      });
      return book;
    })
  });
  myPromise.then(res => console.log(res()));
}

getAllBooks();
getBookByisbn(1);
getBookByAuthor('Chinua Achebe');
getBookByTitle('Things Fall Apart');

module.exports.general = public_users;
