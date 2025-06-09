// src/utils/redis.js
const redis = require('redis');
const config = require('config');

const client = redis.createClient({
  socket: {
    host: config.get('redis.host'),
    port: config.get('redis.port')
  }
});

module.exports = client;