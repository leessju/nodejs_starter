const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');
const Blog = require('../models/Blogs');

router.get('/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
        _user: req.user.id,
        _id: req.params.id
    });

    res.send(blog);
});

router.get('/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({
        key: req.user.id
    });
    res.send(blogs);
});

router.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
        title,
        content,
        _user: req.user.id
    });

    try {
        await blog.save();
        res.send(blog);
    } catch (err) {
        res.send(400, err);
    }
});

module.exports = router;

// 주석처리
// app.get('/api/blogs', requireLogin, async (req, res) => {
//   const redis = require('redis');
//   const redisUrl = 'redis://127.0.0.1:6379';
//   const client = redis.createClient(redisUrl);
//   const util = require('util');
//   client.get = util.promisify(client.get);

//   // Do we have any cached data in redis related
//   // to this query
//   const cachedBlogs = await client.get(req.user.id);

//   // if yes, then respond to the request right away
//   // and return
//   if(cachedBlogs) {
//     console.log('Serving from cache');
//     return res.send(JSON.parse(cachedBlogs));
//   }

//   // if no, we need to respond to request
//   // and update our cache to store

//   const blogs = await Blog.find({ _user: req.user.id });

//   res.send(blogs);
//   console.log('Serving from mongodb');

//   client.set(req.user.id, JSON.stringify(blogs));
//   console.log('Saving to redis');

//   // const query = Person
//   //   .find({ occupation: /host/ })
//   //   .where('name.last').equals('Ghost')
//   //   .where('age').gt(17).lt(66)
//   //   .where('likes').in(['vaporizing', 'talking'])
//   //   .limit(10)
//   //   .sort('-occupation')
//   //   .select('name occupation');
//   //   //.exec(callback);
//   // // Check to see if this query has already been
//   // // fetched in redis

//   // // cache key
//   // query.qetOptions();

//   // query.exec = function() {
//   //   // to check to see if this query has already been excuted
//   //   // and if it has return
//   //   const result = client.get('query key');
//   //   if(result){
//   //     return result
//   //   }

//   //   // otherwise issue the query *as normal*
//   //   const result = runTheOriginalQueryFunction();

//   //   // then save that value in redis
//   //   client.set('query key', result);
//   //   return;
//   // }

//   // query.exec((err, result) => {
//   //   console.log(result);
//   // });

//   // query.then(result => console.log(result));

//   // const result = await query;

//   // //client.flushall();
//   // //client.set('color', 'red', 'EX', 5);

// });
