const express = require('express');
const router = express.Router();
const request = require('request')
const http = require('http');
const fs = require("fs");

var stationUrl = 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y';


router.get('/', (req, res) => {
	request(stationUrl, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var info = JSON.parse(body);
			var infoAll = eval(info.root.stations.station);
			var station = [];
			for(i in infoAll) {
				station.push(infoAll[i]);
			}
			res.setHeader('Content-Type', 'application/json');
			res.send({station});
		} else {
			res.status(404).end();
		}
	});
});


module.exports = router;
