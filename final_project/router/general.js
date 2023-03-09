const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.status(400).json({ message: "username and password is required" });
  }
  if (!isValid(username)) {
    res.status(400).json({ message: "username already exists" });
  }
  let user = { username, password };
  users.push(user);
  return res.status(200).json({ message: "user registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here

  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let filtered_Book = books[isbn];
  return res.status(200).json({ book: filtered_Book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  let filteredBooks = Object.values(books).filter(
    (book) => book.author == author
  );
  return res.status(200).json({ book: filteredBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  let filteredBooks = Object.values(books).filter(
    (book) => book.title == title
  );
  return res.status(200).json({ book: filteredBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  return res.status(200).json({ reviews });
});

// task10
async function getAllBooks() {
  try {
    let books = await axios.get("http://localhost:5000/");
    return books.data;
  } catch (error) {
    console.log(error);
  }
}

// task11
async function getBookDetailIsbn(isbn) {
  try {
    let detail = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return detail.data;
  } catch (error) {
    console.log(error);
  }
}
// task12
async function getBookDetailAuthor(author) {
  try {
    let detail = await axios.get(`http://localhost:5000/author/${author}`);
    return detail.data;
  } catch (error) {
    console.log(error);
  }
}
// task13
async function getBookDetailTitle(title) {
  try {
    let detail = await axios.get(`http://localhost:5000/title/${title}`);
    return detail.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports.general = public_users;
