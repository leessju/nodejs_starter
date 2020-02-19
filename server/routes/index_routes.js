let express = require('express');
let router = express.Router();
let path = require('path');

router.get('/', function(req, res, next) {
    //res.sendFile(__dirname + '../test.html');
    //res.sendFile(path.join(__dirname, '../', 'test.html'));
    res.send("Welcome to My nicejames' World. This is your safety zone.");
});

module.exports = router;
