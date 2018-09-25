'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

if (process.env.NODE_ENV !== 'producation') {
	var webpack = require("webpack");
	var webpackDevMiddleware = require("webpack-dev-middleware");
	var webpackHotMiddleware = require("webpack-hot-middleware");

	var config = require("../webpack.config");
	config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	var bundler = webpack(config);
	app.use(webpackDevMiddleware(bundler, { noInfo: true }));
	app.use(webpackHotMiddleware(bundler, { log: console.log }));
}

app.get('/api/issues', function (req, res) {
	db.collection('issues').find().toArray().then(function (issues) {
		var metadata = { total_count: issues.length };
		res.json({ _metadata: metadata, records: issues });
	}).catch(function (err) {
		console.log(err);
		res.status(500).json({ message: 'Internal Server Error: ' + err });
	});
});

// app.get("/api/issues", (req, res) => {
// 	const metaData = {total_count: issues.length};
// 	res.json({_metadata: metaData, records: issues});
// });

app.post("/api/issues", function (req, res) {
	var newIssue = req.body;
	// newIssues.id = issues.length + 1;
	newIssue.created = new Date();
	if (!newIssue.status) {
		newIssue.status = "New";
	}
	var err = _issue2.default.validateIssue(newIssue);

	if (err) {
		res.status(422).json({ message: 'Invalid request: ' + err });
		return;
	}

	///WHY!!!!!!!!?!?!?!?!?!?!?!?!
	db.collection('issues').insertOne(newIssue).then(function (result) {
		return db.collection('issues').find({ _id: result.insertedId }).limit(1).next();
	}).then(function (newIssue) {
		return res.json(newIssue);
	}).catch(function (err) {
		console.log(err);
		res.status(500).json({ message: 'Internal Server Error: ' + err });
	});
});

// let db;
// MongoClient.connect("mongodb://localhost:27017/issuetracker").then(connection =>{
// 	db = connection;
// 	app.listen(3000, () => {
// 		console.log("App started on Port 3000");
// 	})
// }).catch(err => {
// 	console.log("ERROR: ", err);
// });

var db = void 0;
_mongodb.MongoClient.connect("mongodb://localhost:27017/", function (err, client) {
	db = client.db("issuetracker");
	if (err) {
		console.log("ERROR: ", err);
		return;
	}
	app.listen(3000, function () {
		console.log("App started on port 3000");
	});
});
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