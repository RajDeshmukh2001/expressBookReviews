const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(401).json({ message: "Fields are empty" });
  }

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(409).json({ message: "User already exist" });
    }
  }
  return res.status(403).json({ message: "User registration failed" });
});

// Function to fetch books data using Promises
const fetchBooksData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: books });
    }, 500);
  });
};

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await fetchBooksData();
    res.status(200).json(response.data)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }

  // Task 1: Get the book list available in the shop
  // res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;

  fetchBooksData()
    .then((booksData) => {
      const bookInfo = booksData.data[ISBN];
      if (bookInfo) {
        res.status(200).json(bookInfo);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    })
    .catch((error) => {
      console.error('Error fetching books:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    });

  // Task 2: Get the books based on ISBN.
  // res.send(books[ISBN]);
});

// Function to get book details based on author
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const keysForBooks = Object.keys(books);
    const matchingBooks = [];

    keysForBooks.forEach((bookId) => {
      const book = books[bookId];

      if (book.author === author) {
        matchingBooks.push({
          id: bookId,
          author: book.author,
          title: book.title,
          reviews: book.reviews,
        });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error('No books found for the specified author.'));
    }
  });
};

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  getBooksByAuthor(author)
    .then((matchingBooks) => {
      res.json({ books: matchingBooks });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });

  // Task 3: Get all books by Author. 
  // const keysForBooks = Object.keys(books);
  // const matchingBooks = [];
  // keysForBooks.forEach((bookId) => {
  //   const book = books[bookId];

  //   if (book.author === author) {
  //     matchingBooks.push({
  //       id: bookId,
  //       author: book.author,
  //       title: book.title,
  //       reviews: book.reviews,
  //     });
  //   }
  // });
  // if (matchingBooks.length > 0) {
  //   res.json({ books: matchingBooks });
  // } else {
  //   res.status(404).json({ message: 'No books found for the specified author.' });
  // }
});

// Function to get book details based on title
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const keysForBooks = Object.keys(books);
    const matchingBooks = [];

    keysForBooks.forEach((bookId) => {
      const book = books[bookId];

      if (book.title === title) {
        matchingBooks.push({
          id: bookId,
          author: book.author,
          title: book.title,
          reviews: book.reviews,
        });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error('No books found for the specified title.'));
    }
  });
};

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  getBooksByTitle(title)``
    .then((matchingBooks) => {
      res.json({ books: matchingBooks });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });

  // Task 4: Get all books based on Title 
  // const keysForBooks = Object.keys(books);
  // const matchingBooks = [];
  // keysForBooks.forEach((bookId) => {
  //   const book = books[bookId];

  //   if (book.title === title) {
  //     matchingBooks.push({
  //       id: bookId,
  //       author: book.author,
  //       title: book.title,
  //       reviews: book.reviews,
  //     });
  //   }
  // });
  // if (matchingBooks.length > 0) {
  //   res.json({ books: matchingBooks });
  // } else {
  //   res.status(404).json({ message: 'No books found for the specified title.' });
  // }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
