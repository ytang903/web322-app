const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = process.env.PORT || 3000;
app.use(express.static('public'));

app.get("/", function(req, res){
    res.redirect("/about")
})

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "./views/about.html"))
})


app.listen(HTTP_PORT, function(){
    console.log("server start")
})