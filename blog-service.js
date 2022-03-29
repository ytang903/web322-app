const Sequelize = require('sequelize');

var sequelize = new Sequelize('d8i18p5jf6ggr2', 'chepxudtbazwhp', '9c9c4433d3ec26def5a7995588b37dac0c5e4cbde020f4b0a9f280143b22a825', {
    host: 'ec2-54-157-79-121.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT, 
    title: Sequelize.STRING, 
    postDate: Sequelize.DATE, 
    featureImage: Sequelize.STRING, 
    published: Sequelize.BOOLEAN 
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});




module.exports.Initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            console.log('Connection has been established successfully.');
            resolve();

        }).catch(function (err) {
            reject("unable to sync the database");
        });
    });
};


module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            order: ['id']
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPosts = function(published){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where:{
                published: true
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where:{
                published: true,
                category: category
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });
}


module.exports.getCategories = function(){
    return new Promise(function(resolve, reject){
        Category.findAll({
            order: ['id']
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}



module.exports.addPost = function(postData){
    postData.published = (postData.published) ? true : false;
    for (let i in postData){
        if (postData[i] == ""){
            postData[i] = null;
        }
    }

    return new Promise((resolve,reject)=>{
        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to create post");
        });
    });
}


module.exports.addCategory = function(categoryData){
    for (let i in categoryData){
        if (categoryData[i] == ""){
            categoryData[i] = null;
        }
    }

    return new Promise((resolve,reject)=>{
        Category.create({
            id: categoryData.id,
            category: categoryData.category,
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to create category");
        });
    });
}

module.exports.getPostsByCategory = function(category){
    return new Promise(function(resolve, reject){
        Post.findAll({
            where:{
                category: category
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}

module.exports.getPostsByMinDate = function(minDateStr){
    return new Promise(function(resolve, reject){
        const { gte } = Sequelize.Op;
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}


module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                id: id
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}


module.exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                resolve();
            }).catch((err)=>{
                reject("Unable to remove category / category not found");
            });
        });
    };


    module.exports.deletePostById = (id) =>{
        return new Promise((resolve, reject)=>{
            Post.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                resolve();
            }).catch((err)=>{
                reject("Unable to remove post / post not found");
            });
        });
    };