const express = require("express");     // requiring express

const app = express();                  // making express app
let newItems = [];              // global newItems array used to store the items of list

const date = require(__dirname +"/date.js");

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.set('view engine', "ejs");      // Setting up ejs in our node app


app.get('/', (req, res)=> {      // making app get method

    let day = date.getDate();
    res.render('list', {nowDay: day, newItemList: newItems});

});

app.post("/", (req, res) => {
    let newItem = req.body.item;        // catching the post variable
    newItems.push(newItem);             // pushing the new item to the array of newItems
    res.redirect("/");                  // redirecting user to the home route
    
});



app.listen(process.env.PORT || 3000 , () => {       // app listening on port 3000
    console.log("Server started at port 3000");
});