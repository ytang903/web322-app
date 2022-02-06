var fs = require("fs");
var posts = [];
var categories = [];

module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        try{
            fs.readFile('./data/posts.json', function(err, data){
                if(err)
                throw err;
                posts = JSON.parse(data);
            });
            fs.readFile('./data/categories.json', function(err, data) {
                if (err) throw err;
                categories = JSON.parse(data);
            });
        }catch (ex){
            reject("unable to read file");
        }
        resolve("File successfully read.");
    });
}


module.exports.getAllPosts = function(){
    return new Promise(function(resolve, reject){
        for (var i = 0; i < posts.lenght; i++){
            posts.push(posts[i]);
        }
        if(posts.lenght == 0){
            reject("no results returned")
        }
        resolve(posts);
    });
}

  module.exports.getPublishedPosts = function(){
    var post = [];
    return new Promise(function(resolve, reject){
        for(i = 0; i < posts.length; i++){
            if(posts[i].published == true){
                post.push(posts[i])
            };
        }
        if(post.lenght == 0){
            reject("no results returned")
        }
        resolve(post);
    });
}

module.exports.getCategories = function(){
    return new Promise(function(resolve, reject){
        if(categories.lenght == 0){
            reject("no results returned")
        } 
        else
        {
            for (var i = 0; i < categories.lenght; i++){
                categories.push(categories[i]);
        }
        resolve(categories);
        }
    });
}


            