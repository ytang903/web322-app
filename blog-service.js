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
        if(posts.length == 0){
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
        if(post.length == 0){
            reject("no results returned")
        }
        resolve(post);
    });
}

module.exports.getPublishedPostsByCategory = function(category){
    var post = [];
    return new Promise(function(resolve, reject){
        for(i = 0; i < posts.length; i++){
            if(posts[i].published == true && post.category == category){
                post.push(posts[i])
            };
        }
        if(post.length == 0){
            reject("no results returned")
        }
        resolve(post);
    });
}



module.exports.getCategories = function(){
    return new Promise(function(resolve, reject){
        if(categories.length == 0){
            reject("no results returned")
        } 
        else
        {
        resolve(categories);
        }
    });
}

module.exports.addPost = function(postData){
    return new Promise(function (resolve, reject){
        if (postData.published == undefined){
            postData.published == false;
        }
        else{
            postData.published == true;
        }
        postData.id = posts.length + 1;
        posts.push(postData.postDate);
        resolve(postData);
    })
}

module.exports.getPostsByCategory = function(category){
    var post = [];
    return new Promise(function(resolve, reject){
        for(var i=0; i<posts.length; i++){
            if(posts[i].category == category)
            post.push(posts[i]);
        }  
        
         if(post.length == 0)
                reject("no results returned");
        resolve(post);
    });
}

module.exports.getPostsByMinDate = function(minDateStr){
    var post = [];
    return new Promise(function(resolve, reject){
        for(var i=0; i<posts.length; i++){
            if(new Date(posts[i].postDate) >= new Date(minDateStr)){
                post.push(posts[i]);
            }
        }  
        
        if(post.length == 0)
            reject("no results returned");
        resolve(post);
    });
}

module.exports.getPostById = function(id){
    var post;
    return new Promise((resolve, reject)=>{
            post = posts.filter(element=>{return element.id==id});
            if(post.length ==0)
                reject("no result returned!");
            resolve(post);
    });
}
            