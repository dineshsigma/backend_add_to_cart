let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let connection = require("./db.js");
let currentUser = require("./currentUser.js");
let app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.options("*", cors());
app.use(cors());
let port = 3001;


//----------------DATABASE CONNECTION --------------------------------//
connection.connect(function (err) {
  if (!err) {
    console.log("ESTABLISHED THE CONNECTION :DATABASE IS CONNECTED");
  } else {
    console.log(err);
    console.log("CONNECTION FAILED:DATABASE NOT CONNECTED");
  }
});

//deployment for Testing URL

app.get('/addtocart',async(req,res)=>{
    return res.send('Add to Cart Server is Running Good')
})



let users = require("./controllers/users.js");
app.use("/api/v1/users", users);

app.use(currentUser);
app.use("/api/v1/order", users);

//-------------------SERVER IS RUNNING ON PORT -----------------------//
app.listen(port, function (error) {
  if (error) throw error;
  console.log(`SERVER CONNECTION SUCCESSFULLY ON  PORT ${port}`);
});