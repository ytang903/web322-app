/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Yao Yuan Tang       Student ID: 146454202     Date: 11/17
*
*  Online (Heroku) URL: https://mighty-bastion-45000.herokuapp.com/about
*
*  GitHub Repository URL: https://github.com/ytang903/web322-app.git
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const blog_service = require("./blog-service");
const HTTP_PORT = process.env.PORT || 3000;
app.use(express.static('public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
    return new Promise(function(req, res){

        blog_service.initialize().then(function(data) {
            console.log(data)
        }).catch(function(err) {
            console.log(err);
        });
    });
}

app.get("/", function(req, res){
    res.redirect("/about")
})
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "./views/about.html"))
})

app.get("/blog", function(req, res){
    blog_service.getAllPosts().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err });
    });
});


app.get("/posts", function(req, res){
    blog_service.getPublishedPosts().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err });
    });
});


app.get("/categories", function(req, res){
    blog_service.getCategories().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err });
    });
})

app.use(function(req, res){
    res.status(404).send("Page Not Found");
});



app.listen(HTTP_PORT, onHttpStart);