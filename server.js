const express = require("express");
const mustacheExpress = require('mustache-express');

const routes = require("./routes");

const server = express();
server.use(express.json());
server.engine('mustache', mustacheExpress());
server.set('view engine', 'mustache');

server.use(express.static("static"));

server.use(routes);

module.exports = server;
