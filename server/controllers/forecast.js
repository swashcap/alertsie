'use strict';

const boom = require('boom');
const makeRequest = require('../utils/make-request.js');

module.exports.get = (
  {
    params: {
      apiKey,
      latitude,
      longitude,
    },
    server,
  },
  reply
) => makeRequest({
  headers: {
    'Accept-Encoding': 'gzip,deflate',
  },
  host: 'api.darksky.net',
  path: `/forecast/${apiKey}/${latitude},${longitude}`,
})
  .then(reply)
  .catch((error) => {
    server.log('error', error.message);
    return boom.wrap(error);
  });

