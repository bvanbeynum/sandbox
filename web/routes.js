var path = require("path");
var mongo = require('mongodb').MongoClient;

module.exports = function (app) {
	
	app.get("*.html", function (request, response) {
		var file = request.path.substring(request.path.indexOf("/") + 1);
		response.sendFile(file, { root: path.join(__dirname, "./html") });
	});
	
	app.get("*.*", function(request, response) {
		var file = request.path.substring(request.path.indexOf("/") + 1);
		response.sendFile(file, { root: path.join(__dirname, "./media") });
	});
	
	app.post("/save", function (request, response) {
		console.log("here");
	});
	
	app.post("/savelog", function (request, response) {
		if (!request.body.data) {
			response.status(500).send({error: {name: "save error", message: "Missing data"}});
			return;
		}
		console.log(request.body.data);
		console.log(JSON.parse(request.body.data));
		
		mongo.connect("mongodb://localhost:27017/logData", function (err, db) {
			if (err) {
				response.status(500).send({error: err});
				return;
			}
			
			db.authenticate("webUser", "fEw!i_jIi4e", function (err, db) {
				if (err) {
					response.status(500).send({error: err});
					return;
				}
				
				var generalCol = db.collection("general");
				generalCol.insertOne(saveData, function (err, result) {
					db.close();
					
					if (err) {
						response.status(500).send({error: err});
					}
					else {
						response.status(200).send({status: "ok"});
					}
				});
			});
		});
	});
	
	app.get("/logsensor", function(request, response) {
		if (request.query.type && request.query.action) {
			mongo.connect("mongodb://localhost:27017/pi", function(err, db) {
				if (err) {
					response.send({error: err});
				}
				else {
					db.authenticate("webUser", "fEw!i_jIi4e", function(err, res) {
						
						if (err) {
							response.send({error: err});
							return;
						}
						
						var logsCollection = db.collection("logs");
						logsCollection.insertOne({type: request.query.type, action: request.query.action, timestamp: new Date()}, function (err, result) {
							db.close();
							
							if (err) {
								response.send({error: err});
							}
							response.send({status: "OK"});
						});
					
					});
				}
			});
		}
		else {
			response.send({error: "bad request"});
		}
		console.log(request.query);
	});
	
	app.get("/getsensor", function(request, response) {
		response.header("Access-Control-Allow-Origin", "*");
		
		mongo.connect("mongodb://localhost:27017/pi", function(err, db) {
			if (err) {
				response.send({error: err});
			}
			else {
				db.authenticate("webUser", "fEw!i_jIi4e", function(err, res) {
					if (err) {
						response.send({error: err});
					}
					
					var logsCollection = db.collection("logs"),
						startDate = new Date();
					
					startDate.setDate(startDate.getDate() - 7);
					
					logsCollection.find({timestamp: {$gte: startDate } }).toArray(function (err, docs) {
						if (err) {
							response.send({error: err});
						}
						
						response.send(docs);
					});
				});
			}
		});
	});
	
};