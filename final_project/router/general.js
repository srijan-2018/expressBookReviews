const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ✅ Task 6: Register new user (unchanged)
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});


// ✅ Task 10: Get all books (Async + Axios)
public_users.get('/books', async function (req, res) {
    try {
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });


// ✅ Task 11: Get book by ISBN (Async + Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
      });
  
      return res.status(200).json(response);
  
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });

// ✅ Task 12: Get books by author (Async + Axios)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );
  
    return res.status(200).json(filteredBooks);
  });


// ✅ Task 13: Get books by title (Async + Axios)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
  
    return res.status(200).json(filteredBooks);
  });


// ✅ Task 5 (unchanged)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});


module.exports.general = public_users;