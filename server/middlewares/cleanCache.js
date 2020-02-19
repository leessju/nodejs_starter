const { clearHash } = require('../utils/cache');
const keys = require('../config/_keys');

module.exports = async (req, res, next) => {
    await next();
    clearHash(keys.cache_key);
};