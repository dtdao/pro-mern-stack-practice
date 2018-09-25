'use strict'
const express = require("express");
const bparser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const Issue = require("./issue.js");

const app = express();
app.use(express.static('static'));
app.use(bparser.json());

app.get('/api/issues', (req, res) => {
	db.collection('issues').find().toArray().then(issues => {
		const metadata = {total_count: issues.length};
		res.json({_metadata: metadata, records: issues});
	}).catch(err => {
		console.log(err);
		res.status(500).json({message: `Internal Server Error: ${err}`});
	})
})



// app.get("/api/issues", (req, res) => {
// 	const metaData = {total_count: issues.length};
// 	res.json({_metadata: metaData, records: issues});
// });

app.post("/api/issues", (req, res) => {
	const newIssue = req.body;
	// newIssues.id = issues.length + 1;
	newIssue.created = new Date();
	if(!newIssue.status){
		newIssue.status = "New"
	}
	const err = Issue.validateIssue(newIssue)

	if(err){
		res.status(422).json({message: `Invalid request: ${err}`});
		return;
	}

	///WHY!!!!!!!!?!?!?!?!?!?!?!?!
	db.collection('issues').insertOne(newIssue).then(result => 
		 db.collection('issues').find({_id: result.insertedId}).limit(1).next()
	).then(newIssue =>
		res.json(newIssue)
	).catch(err => { 
		console.log(err);
		res.status(500).json({message: `Internal Server Error: ${err}`});
	})

})

// let db;
// MongoClient.connect("mongodb://localhost:27017/issuetracker").then(connection =>{
// 	db = connection;
// 	app.listen(3000, () => {
// 		console.log("App started on Port 3000");
// 	})
// }).catch(err => {
// 	console.log("ERROR: ", err);
// });

let db;
MongoClient.connect("mongodb://localhost:27017/", (err, client) => {
	db = client.db("issuetracker");
	if(err) {
		console.log("ERROR: ", err);
		return;
	}
	app.listen(3000, () => {
		console.log("App started on port 3000");
	})
})
// MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
// 	db = client.db("issuetracker");
// 	app.listen(3000, () => {
// 		console.log("App started on port 3000");
// 	})

// 	db.collection('issues').find().toArray().then(issues => {
// 		const metaData = {total_count: issues.length}
// 		res.json({_metadata: metaData, records: issues})
// 	}).catch(err =>{
// 		console.log(err);
// 		res.status(500).json({message: `Internal Server Error: ${err}`});
// 	})
// })
