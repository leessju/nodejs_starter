const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/_keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.model.collection.name
        })
    );

    console.log('==== key ===> ' + key);

    const cacheValue = await client.hget(this.hashKey, key);
    if (cacheValue && cacheValue !== []) {
        console.log('=== value ===> ' + cacheValue);
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 5);
    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
