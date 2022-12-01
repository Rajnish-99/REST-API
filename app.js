const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);


// routing chained here
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {

    newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

////// request targeting the specific articles



app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("no article matching that title found");
      }
    })
  })
  .put(function(req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("data updated successfully");
        } else {
          res.send("data not updated");
        }
      }
    )
  })
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("data patched successfully");
        }
        else{
          res.send(err);
        }
      }
    )
  })
  app.delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("data deleted successfully");
        }
        else{
          res.send(err);
        }
      }
    )
  }); 

app.listen(3000, function() {
  console.log("server is up bois");
});
