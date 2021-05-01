
const express = require('express');
const routes = require('./routes');
var cors = require('cors')

const server = express();
server.use(express.json());
server.use(cors())

server.use('/', routes);

module.exports = server;