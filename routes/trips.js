const express = require('express');
const router = express.Router();
const request = require('request')
const http = require('http');
const fs = require("fs");
const URL = require('url').URL;
const axios = require('axios');

var departUrl = new URL('http://api.bart.gov/api/sched.aspx?cmd=depart&orig=&dest=&date=now&key=MW9S-E7SL-26DU-VV8V&b=0&a=4&l=0&json=y');

router.get('/', (req, res, next) => {
        var src = req.query.source;
	var des = req.query.dest;
        //console.log(src);
	//console.log(des);
        if(src == undefined || des == undefined) {
                res.status(404).end();
	} else {
		departUrl.searchParams.set('orig', src);
		departUrl.searchParams.set('dest', des);

		axios.get(departUrl.href).then(function(response) {
			//console.log(response.data.root.schedule.request);
			res.send(response.data.root.schedule.request);
		}).catch(function (error) {
			console.log('Error occured');
		});
		
	}
});

module.exports = router;
