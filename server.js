var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
//var app = express();
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static("public"));

var routes = require("./controllers/app.js");
app.use(routes);
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
