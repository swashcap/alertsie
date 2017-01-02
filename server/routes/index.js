'use strict';

const files = require('../controllers/files.js');
const forecast = require('../controllers/forecast.js');
const index = require('../controllers/index.js');
const sample = require('../controllers/sample.js');

module.exports = [{
  method: 'GET',
  path: '/',
  handler: index.get,
}, {
  method: 'GET',
  path: '/{file*}',
  handler: files.get,
}, {
  method: 'GET',
  path: '/api/sample',
  handler: sample.get,
}, {
  method: 'GET',
  path: '/api/forecast',
  handler: forecast.get,
}];

