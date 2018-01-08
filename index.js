var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
var engine = require('ejs-locals');
app.engine('ejs', engine);
// create server
var server = require("http").createServer(app);
server.listen(process.env.PORT || 3000, function() {
    console.log("Created Server: port " + server.address().port);
});

app.get("/", function(req, res) {
    res.render('pages/home', { 
        title: 'Home page',
        description : "A Blog Theme by Start Bootstrap"
    });
})

app.get("/about", function(req, res) {
    res.render('pages/about', { 
        title: 'About page',
        description : "This is About page"
    });
})

app.get("/contact", function(req, res) {
    res.render('pages/contact', { 
        title: 'Contact page',
        description : "This is Contact page"
    });
})