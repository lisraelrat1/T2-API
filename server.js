const express = require('express');
const routes = require('./routes');
var cors = require('cors')

const server = express();
server.use(express.json());
server.use(cors())

server.use('/', routes);


if (process.env.NODE_ENV === 'production') {
	server.use(express.static('client/build'));
}

module.exports = server;