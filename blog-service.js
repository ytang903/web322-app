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
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post => post.published);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned");
    });
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post => post.published && post.category == category);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned");
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
    return new Promise((resolve,reject)=>{
        postData.published = postData.published ? true : false;
        postData.id = posts.length + 1;
        let now = new Date();
        postData.postDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        posts.push(postData);
        resolve();
    });
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
    return new Promise((resolve,reject)=>{
        let foundPost = posts.find(post => post.id == id);

        if(foundPost){
            resolve(foundPost);
        }else{
            reject("no result returned");
        }
    });
}
            