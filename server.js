/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Yao Yuan Tang       Student ID: 146454202     Date: 2/21
*
*  Heroku App URL: ___________________________________________________________
* 
*  GitHub Repository URL: ______________________________________________________
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const blog_service = require("./blog-service");

const multer = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: 'oliver903',
    api_key: '465668376711839',
    api_secret: 'wTE_uwqm4GoiE9b89kAohKkwJiY',
    secure: true
});

const upload = multer(); 


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
    blog_service.getPublishedPosts().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err });
    });
});


app.get("/posts", function(req, res){
    if(req.query.category){
        blog_service.getPostsByCategory(req.query.category).then(function(data){
            res.json(data);
        }).catch(function(err){
            res.json({message: err});
        })
    }
    else if(req.query.minDateStr){
        blog_service.getPostsByMinDate(req.query.minDateStr).then(function(data){
            res.json(data);
        }).catch(function (err) {
            res.json({ message: err });
        });
    }
    else{
    blog_service.getAllPosts().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json({message: err });
    });
}
});


app.get("/categories", function(req, res){
        blog_service.getCategories().then(function(data){
            res.json(data);
        }).catch(function(err){
            res.json({message: err });
        });
})

app.get("/post/:id", (req, res) => {
    blog_service.getPostById(req.params.id).then(function (data) {
      res.json(data);
    }).catch(function (err) {
      res.json({ message: err });
    });
});


app.get("/posts/add", function(req,res){
    res.sendFile(path.join(__dirname, "./views/addPost.html"))
})

app.post("/posts/add", upload.single("featureImage"), function(req, res){
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
        
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blog_service.addPost(req.body).then((postData) => {
            res.redirect('/posts')
        })
    });
})


app.use(function(req, res){
    res.status(404).send("Page Not Found");
});




app.listen(HTTP_PORT, onHttpStart);