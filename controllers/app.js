var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
//var app = express();
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
const router = express.Router();
const db = require("../models");
console.log(db);
// Routes
//mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });
// A GET route for scraping the echoJS website

router.get("/", (req, res) => {
  //db.Article.find({})
  db.Article.find({ saved: false })
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      //const retrievedArticles = dbArticle;
      var hbsObject;
      hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


router.get("/saved", (req, res) => {
  db.Article.find({ saved: true })
    .then(function (retrievedArticles) {
      // If we were able to successfully find Articles, send them back to the client
      let hbsObject;
      hbsObject = {
        articles: retrievedArticles
      };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

//Clear all the scrapes

router.get('/clear', function (req, res) {
  db.Article.remove({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log('removed all articles');
    }
  });
  db.Note.remove({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log('removed all notes');
    }
  });
  res.redirect('/');
});


//Scrape the news

router.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/section/sports").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    //<li class="css-ye6x8s"><div class="css-1cp3ece"><div class="css-4jyr1y"><a href="/2019/03/22/sports/who-won-ncaa-tournament-games.html"><div class="css-79elbk"><figure class="css-196wev6 toneNews" aria-label="media" role="group" itemscope="" itemprop="associatedMedia" itemid="https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-thumbWide.jpg?quality=30&amp;auto=webp" itemtype="http://schema.org/ImageObject"><div class="css-79elbk"><span class="css-1dv1kvn">Image</span><img alt="" class="css-11cwn6f" src="https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-thumbWide.jpg?quality=75&amp;auto=webp&amp;disable=upscale" srcset="https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-thumbWide.jpg?quality=100&amp;auto=webp 190w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-videoThumb.jpg?quality=100&amp;auto=webp 75w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-videoLarge.jpg?quality=100&amp;auto=webp 768w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-mediumThreeByTwo210.jpg?quality=100&amp;auto=webp 210w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-mediumThreeByTwo225.jpg?quality=100&amp;auto=webp 225w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-mediumThreeByTwo440.jpg?quality=100&amp;auto=webp 440w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-mediumThreeByTwo252.jpg?quality=100&amp;auto=webp 252w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-mediumThreeByTwo378.jpg?quality=100&amp;auto=webp 378w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-threeByTwoLargeAt2X.jpg?quality=100&amp;auto=webp 4698w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-threeByTwoMediumAt2X.jpg?quality=100&amp;auto=webp 1500w,https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-threeByTwoSmallAt2X.jpg?quality=100&amp;auto=webp 600w" sizes="(max-width: 600px) 120px, (max-width: 1024px) 165px, 205px" itemprop="url" itemid="https://static01.nyt.com/images/2019/03/22/sports/22ncaa-whowon1/merlin_152421888_0e7e9e5a-476e-42ad-aa6d-e7d1fa33b414-thumbWide.jpg?quality=75&amp;auto=webp&amp;disable=upscale"></div><figcaption itemprop="caption description" class="css-17ai7jg emkp2hg0"></figcaption></figure></div><h2 class="css-1dq8tca e1xfvim30">Who Won Last Night’s N.C.A.A. Tournament Games</h2><p class="css-1echdzn e1xfvim31">A roundup of the scores and highlights. It was more than Ja Morant’s breakout performance.</p><div class="css-1nqbnmb ea5icrr0"><p class="css-1xonkmu">By <span class="css-1n7hynb">The New York Times</span></p></div></a></div><div class="css-umh681 e1xfvim33"><time class="">March 22, 2019</time></div></div></li>
    // Now, we grab every h2 within an article tag, and do the following:
    $("li a").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("h2")
        .text();
      result.link = $(this)
        .attr("href");
      result.summery = $(this)
        .children("p")
        .text();
      /*result.image = $(this)
      .children("p")
      .text();*/
      //var imgLink = $(element).find("a").find("img").attr("data-srcset").split(",")[0].split(" ")[0];
      result.img = $(this).attr("src");
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    res.redirect("/");
    // Send a message to the client
    //res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db

router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Updating the saved article
router.put("/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
});

//delete Article
router.delete("/delete/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { "saved": false }, { new: true })
    .then(function (dbArticle) {      
      //res.redirect("/saved");
    })
    .catch(function (err) {
      // If an error occurred, log it
      console.log(err);
      res.send("Error occurred deleting article");
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Saving note

router.post("/note/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for deleting/updating an Article's associated Note
router.post("/del_note/:id/:noteid", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.findByIdAndDelete(req.params.noteid)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id },{$pull: { notes: dbNote._id }}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
module.exports = router;