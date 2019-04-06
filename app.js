const express = require('express');
const app = express();
const morgan = require('morgan');

const stationsRoutes = require('./routes/stations');
const tripsRoutes = require('./routes/trips');
const stationRoutes = require('./routes/station');

app.use(morgan('dev'));

app.use(express.static('./'));
app.use('/stations', stationsRoutes);
app.use('/trips', tripsRoutes);
app.use('/station', stationRoutes);
/*
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status(404);
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{message: 'error occurs'}
	});
});
*/
module.exports = app;
