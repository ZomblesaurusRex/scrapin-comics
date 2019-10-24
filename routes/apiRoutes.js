var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    app.get("/scrape", function (req, res) {
        db.Article.deleteMany({}, function (err) { // remove all old articles 
            if (err) throw err;

            axios.get("https://www.ign.com/news").then(function (res) {

                // Load the HTML into cheerio
                var $ = cheerio.load(response.data);

                // Make an empty array for saving our scraped info
                var articles = [];

                app.get("/", function (req, res) {
                    res.render("index");
                });

                $("article").each(function (i, element) {
                    var result = {};

                    var articleLink = $(element).find("a").attr("href");
                    var articleDetails = $(element).find("h3").find("span").first().text();
                    var articleImg = $(element).find("a").find("img").attr("src");

                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle);
                        }).catch(function (err) {
                            // If an error occurred, log it
                            console.log(err);
                        });
                });
                res.send("Success!");

            });
        });
    });

            
    app.get("/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticles) {
                res.json(dbArticles);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/articles", function (req, res) {
        db.Article.deleteMany({}, function (err) {
            if (err) throw err;
            res.send("Clear Complete");
        });
    });

    app.post("/save/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .then(function (dbArticle) {

                db.SavedArticle.findOne({ title: dbArticle.articleDetails })
                    .then(function (dbSavedArticle) {

                        if (dbSavedArticle) {
                            res.send("Article already saved")
                        } else {
                            var savedArticle = {};
                            savedArticle.title = dbArticle.articleDetails;
                            savedArticle.link = dbArticle.articleLink;
                            savedArticle.img = dbArticle.ArticleImg;

                            db.SavedArticle.create(savedArticle)
                                .then(function () {
                                    res.send("Saved for Later!");
                                })
                                .catch(function (err) {
                                    res.send(err);
                                });
                        }
                    }).catch(function (err) {
                        res.send(err);
                    });
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    app.get("/saved", function (req, res) {
        db.SavedArticle.find({})
            .then(function (dbSavedArticles) {
                res.json(dbSavedArticles);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/saved", function (req, res) {
        db.SavedArticle.deleteMany({}, function (err) {
            if (err) throw err;
            res.send("Ta Ta for now!");
        });
    });

    app.delete("/saved/:id", function (req, res) {
        db.SavedArticle.deleteOne({ _id: req.params.id }, function (err) {
            if (err) throw err;
            res.send("Just the one? Outta Here!");
        });
    });

    app.post("/saved/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.SavedArticle.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/saved/:id", function (req, res) {
        db.SavedArticle.findOne({ _id: req.params.id })
            .populate("notes")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/notes/:id", function (req, res) {
        db.Note.deleteOne({ _id: req.params.id }, function (err) {
            if (err) throw err;
            res.send("Delete Note Complete");
        });
    });

    // everything in this last tag
        }