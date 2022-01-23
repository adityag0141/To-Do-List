const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){

    var date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = months[date.getMonth()];
    var day = days[date.getDay()];
    var toDate = date.getDate();
    res.render("list", {todayMonth:month, todayDay:day, todayDate:toDate});


})

app.listen(3000, function(){
    console.log("Server is running");
})