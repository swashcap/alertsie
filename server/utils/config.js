'use strict';

const config = require('../../config/index');

if (!config.apiKey) {
  throw new Error('API key required in configuration');
} else if (!config.latitude) {
  throw new Error('Latitude required in configuration');
} else if (!config.longitude) {
  throw new Error('Longitude required in configuration');
}

module.exports = config;

