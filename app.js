const express = require("express");     // requiring express
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();                  // making express app

const date = require(__dirname +"/date.js"); 

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.set('view engine', "ejs");      // Setting up ejs in our node app

// connecting mongoose with the mongodb server on our localhost
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// creating schema for the collection
const itemsSchema = {
    name: String
};

// making collection model with the schema
const Item = mongoose.model("Item", itemsSchema);

// default items to be shown first
const item1 = new Item ( {
    name: "Welcome to the ToDo list"
});
const item2 = new Item ( {
    name: "Hit the + button to add"
});
const item3 = new Item ( {
    name: "<-- Hit the checkbox to delete the item"
});

const defaultItem = [item1, item2, item3];

const day = date.getDate();



app.get('/', (req, res)=> {      // making app get method


    Item.find({}, (err, results) => {
        // checking if the collection array is empty or not 
        if (results.length === 0 ) {
            // inserting all the items as array 
            Item.insertMany(defaultItem, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Inserted the items successfully!");
                }
            });

          res.redirect('/');        // redirecting back to home route to show the effect
        } else {
            res.render('list', {listTitle: day, newItemList: results });
        }
    } ) 
});

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

// Making dynamic custom link for creating new lists
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    

    List.findOne({name: customListName}, (err, result) => {
        if (!err) {
            if (!result) {
                // create new list
                const list = new List ({
                    name: customListName,
                    items: defaultItem
                })
                list.save();
                res.redirect(`/${customListName}`)
            } else {
                // show existing list
                res.render('list', { listTitle: result.name, newItemList: result.items });
      
            }
        }
    })



})

app.post("/", (req, res) => {
        const itemName = req.body.newItem;
        const listName = req.body.list;

        const item = new Item ({        // now getting the new item 
            name: itemName              // and uploading it on the mongoDB with mongoose
        });
        if (listName === day) {
            item.save()
            res.redirect('/')  // redirecting back to home route to show the effect
        } else {
            List.findOne({name: listName}, (err, result) => {
                result.items.push(item);
                result.save();
                res.redirect(`/${listName}`);
            })
        }

});

app.post("/delete", (req, res) => {
    const checkedItemdId = req.body.checked;
    const listName = req.body.listName;

    if (listName === day ) {
        Item.findByIdAndRemove(checkedItemdId, (err) => {
            if (!err) {
                console.log("Deleted checked item successfully")
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemdId}}}, (err, results) => {
            if (!err) {
                res.redirect(`/${listName}`);
            }
        })
    }

    
});




app.listen(process.env.PORT || 3000 , () => {       // app listening on port 3000
    console.log("Server started at port 3000");
});
