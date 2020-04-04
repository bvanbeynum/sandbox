// Setup =======================================================================

var express = require("express");
var app = express();
var port = process.env.PORT || 7578;
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes =======================================================================

app.set("x-powered-by", false);
app.set("root", __dirname);

require("./routes")(app);

// listen (start app with node server.js) ======================================

app.listen(port);
console.log("App listening on port " + port);
