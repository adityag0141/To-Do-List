const env = require("dotenv");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const aws = require("aws-sdk");


app.use(session({
    secret: process.env.S3_PASS,
    resave: false,
    saveUninitialized: false

}));
mongoose.connect(`mongodb+srv://${process.env.S3_KEY}:${process.env.S3_SECRET}@cluster0.zrzyj.mongodb.net/To-Do-List?retryWrites=true&w=majority`);

const userSchema = {
    username: String,
    password: String,
}
const itemsSchema = {
    username: String,
    name: String
}

const User = mongoose.model("user", userSchema);
const Item = mongoose.model("item", itemsSchema);
const task = [];
var uname = "";
const saltRounds = 12;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {

    res.render("login");
});



app.get("/register", function (req, res) {
    res.render("register");
})

app.get("/list", function (req, res) {
    if(req.session.loggedIn === true){

    var sess = req.session;
    var date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = months[date.getMonth()];
    var day = days[date.getDay()];
    var toDate = date.getDate();
    Item.find({username:uname},function (err, items) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("list", { todayMonth: month, todayDay: day, todayDate: toDate, item: items });
        }
    })
}
else{
    res.redirect("/");
}

})


app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
})

// Adding items in the database

app.post("/list", function(req, res){
    const task = new Item({
        username:uname,
        name:req.body.task
    });
    task.save();
    res.redirect("list");


})

// Deleting items from database
app.post("/delete", function (req, res) {
    var del = req.body.delete;
    Item.deleteOne({ _id: del }, function (err) {
        if (err) {
            console.log(err);
        }
    })
    res.redirect("list");
});

// Registering new User

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
        }
        else {
            const user = new User({
                username: req.body.username,
                password: hash,

            });
            user.save();
            req.session.loggedIn = true;
            res.redirect("list");
        }
    })

});

app.post("/login", function(req, res){
    const username = req.body.username;
    User.find({username}, function(err, result){
        if(err){
          
            console.log(err);
        }
        else{
            bcrypt.compare(req.body.password, result[0].password, function(err, bool){
                if(bool===true){
                    uname = username;
                    req.session.loggedIn = true;
                    res.redirect("list");
                }
                else{
                    console.log(err);
                }
            })
        }
    })
})


// Initialising port
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running");
});