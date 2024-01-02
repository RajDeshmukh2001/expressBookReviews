const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(401).json({ message: "Fields are empty" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username }
    return res.status(200).json({ message: "Login successfully" });
  } else {
    return res.status(200).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const review = req.query.review;
  const ISBN = req.params.isbn;

  if (!username || !review || !ISBN) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  // Checking if the provided ISBN exists in the 'books' object
  if (books[ISBN] !== undefined) {
    const book = books[ISBN];

    // Checking if the user has already posted a review for the same ISBN
    if (book.reviews[username] !== undefined) {
      // Modifying the existing review
      book.reviews[username] = review;
      res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Adding a new review
      book.reviews[username] = review;
      res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    res.status(404).json({ message: "Book not found for the specified ISBN." });
  }
});

// Delte a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const ISBN = req.params.isbn;

  if (!username || !ISBN) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  if (books[ISBN] !== undefined) {
    const book = books[ISBN];

    // Checking if the user has posted a review for the same ISBN
    if (book.reviews[username] !== undefined) {
      // Delete the user's review
      delete book.reviews[username];
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found for the specified ISBN." });
    }
  } else {
    res.status(404).json({ message: "Book not found for the specified ISBN." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
