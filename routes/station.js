const express = require('express');
const router = express.Router();
const request = require('request')
const http = require('http');
const fs = require("fs");
const URL = require('url').URL;

const Url = new URL('http://api.bart.gov/api/stn.aspx?cmd=stninfo&key=MW9S-E7SL-26DU-VV8V&json=y&orig=');

router.get('/', (req, res, next) => {
	var addr = req.query.source;
	console.log(addr);
	if(addr == undefined) {
		res.status(404).end();
	}
	else {
	Url.searchParams.set('orig', addr);
	//console.log(Url);	
	request(Url.href, function(err, response, body) {
		//console.log(body);
		if (!err && response.statusCode == 200) {
			try {
				var info = JSON.parse(body);
				var station = eval(info.root.stations.station);
				res.setHeader('Content-Type', 'application/json');
				res.send({station});
			} catch (e) {
				res.status(404).end();
			}
		} else {
			res.status(404).end();
		}
	});
	}
});


module.exports = router;
