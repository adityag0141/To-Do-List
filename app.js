const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect("mongodb+srv://adityagoyal864:boOWWDHlxa7Oeh6H@cluster0.zrzyj.mongodb.net/todolistDB");
const itemsSchema = {
    name: String
}

const Item = mongoose.model("item", itemsSchema);
const task=[];
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {

    var date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = months[date.getMonth()];
    var day = days[date.getDay()];
    var toDate = date.getDate();
    Item.find(function(err, items){
        if(err){
            console.log(err);
        }
        else{
            res.render("list", { todayMonth: month, todayDay: day, todayDate: toDate, item:items });
        }
    })



});

// Adding items in the database

app.post("/", function (req, res) {
    const val = new Item({
        name: req.body.task,
    })
    val.save();
    res.redirect("/");
});

// Deleting items from database
app.post("/delete", function (req, res) {
    var del = req.body.delete;
    Item.deleteOne({_id:del}, function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect("/");
});

// Initialising port
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running");
});