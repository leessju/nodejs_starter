const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
var compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const common = require('./server/utils/common');
const keys = require('./server/config/_keys');
const app = express();

var index_routes = require('./server/routes/index_routes');
var dog_routes = require('./server/routes/dog_routes');
var blog_routes = require('./server/routes/blog_routes');
var car_routes = require('./server/routes/car_routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'server/log', `${common.today('YYYY_MM_DD')}.log`), { flags: 'a' })}));
app.use(express.static(path.join(__dirname, 'server/public')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb connected!');

        //app.use(bodyParser.json());
        app.use(
            cookieSession({
                maxAge: 30 * 24 * 60 * 60 * 1000,
                keys: [keys.cookieKey]
            })
        );
        // app.use(passport.initialize());
        // app.use(passport.session());

        app.use('/s', blog_routes);
        app.use('/c', car_routes);
    })
    .catch(err => {
        console.log(err);
    });

app.use('/', index_routes);
app.use('/a', dog_routes);

// app.get('/', (req, res) => {
//   res.send('hello.');
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server staring (${port})...`);
});