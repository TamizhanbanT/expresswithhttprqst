// Import necessary modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser'); // body-parser for JSON parsing
const mysql = require('mysql2'); // MySQL database connection

// Initialize the app instance
const app = express();

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hornet@sql#123',
    database: 'ta_maths'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Set up middleware
app.use(logger('dev'));
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: false })); // URL-encoded parser
app.use(cookieParser()); // Cookie parser
app.use(bodyParser.json()); // Body parser middleware

// View engine setup (default is Pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Import routes AFTER the app instance has been initialized
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Import the students route (move this below the middleware)
app.use('/students', require('./routes/students'));

// Import the Mentor route (move this below the middleware)
app.use('/mentors', require('./routes/mentors'));

// Import the classes route (move this below the middleware)
app.use('/class', require('./routes/classes'));


// Catch 404 errors and forward them to the error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Export the app
module.exports = app;
