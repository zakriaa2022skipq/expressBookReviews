const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.filter((user)=>user.username == username)
    if(user.length>0){
        return false
    }else{
        return true
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let user = users.filter((user)=>user.username == username && user.password == password)
    if(user.length > 0){
        return true
    }else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if(!username || !password){
      return res.status(404).json({message: "User cannot be authenticated"});
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({data:username},'secret',{expiresIn:60*60})
        req.session.authorization = {accessToken,username}
        res.status(200).json({message:'user logged in successfully'})
    }else{
      return res.status(404).json({message: "User cannot be authenticated"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let reviewText = req.query.review
    let username = req.user.data
    let isbn = req.params.isbn
    let reviews = books[isbn].reviews
    reviews[username] = reviewText;
  //Write your code here
  return res.status(200).json({message: "review added",reviews});
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    let isbn = req.params.isbn
    let username = req.user.data;
    let reviews = books[isbn].reviews
    delete reviews[username]
    return res.status(200).json({message:"review deleted successfully"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
