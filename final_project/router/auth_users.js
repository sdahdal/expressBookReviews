const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let filtered = users.filter((user) => {
    return user.username === username
  });
  return filtered.length > 0 ? true : false;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let filtered = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return filtered.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let { username, password } = req.body;
  if (!username || !password)
    return res.status(404).json({ message: "Error logging in" });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else
    return res.status(208).json({ message: "Invalid Login. Check username and password" });

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review = req.query.review;
  let isbn = req.params.isbn;
  let username = req.session.authorization['username'];
  if (!username)
    return res.status(208).json({ message: 'Invalid sesiion' });
  books[isbn].reviews[username] = review;
  res.send({ message: 'review added successsfully' });
  // return res.status(300).json({ message: "Yet to be implemented" });
});


// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization['username'];
  if (!username)
    return res.status(208).json({ message: 'Invalid sesiion' });
  delete books[isbn].reviews[username];
  res.send({ message: 'review deleted successsfully' });
  // return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
