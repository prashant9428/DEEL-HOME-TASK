const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model');
const router = require("./module/router");
const errorHandler = require("./middleware/errorHandler");
const pageNotFound = require("./middleware/pageNotFound");

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use(router); 
app.use("*",pageNotFound)
app.use(errorHandler) // error handle middleware

module.exports = app;
