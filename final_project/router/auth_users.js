const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


// ✅ Check if username is available (for registration)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};


// ✅ Validate username & password (for login)
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};


// ✅ Task 7: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid login credentials" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Store token in session
  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({
    message: "User successfully logged in",
    token: accessToken
  });
});


// ✅ Task 8: Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  const username = req.session.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});


// ✅ Task 9: Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully"
    });
  } else {
    return res.status(404).json({
      message: "No review found for this user"
    });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;