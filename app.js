require('dotenv/config');
require('./db');
const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();

require('./config')(app);
require('./config/session.config')(app);

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.set('views', path.join(__dirname, 'views'));

const userRoutes = require('./routes/user.routes');
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

require('./error-handling')(app);

module.exports = app;