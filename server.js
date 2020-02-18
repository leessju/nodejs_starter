const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const passport   = require('passport');
const path       = require('path');
const fs         = require('fs');
var compression  = require('compression');
const helmet     = require('helmet');
const morgan     = require('morgan');
const common     = require('./server/utils/common');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
//app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'server/log', `${common.today('YYYY_MM_DD')}.log`), { flags: 'a' })}));
app.use(express.static(path.join(__dirname, 'server/public')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.get('/', (req, res) => {
  res.send('Welcome to My nicejames\' World. This is your safety zone.');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server staring (${port})...`);
});