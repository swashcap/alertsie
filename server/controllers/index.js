'use strict';

const {
  darkSkyAPIKey,
  googleAPIKey,
  latitude,
  longitude,
} = require('../utils/config.js');

module.exports.get = ({ server }, reply) => Promise.all([
  server.inject({
    payload: {
      apiKey: googleAPIKey,
      latitude,
      longitude,
    },
    url: '/api/address',
  }),
  server.inject({
    payload: {
      apiKey: darkSkyAPIKey,
      latitude,
      longitude,
    },
    url: '/api/sample',
  }),
])
  .then(([{ payload: address }, { payload: forecast }]) => reply.view(
    'index',
    Object.assign(JSON.parse(address), JSON.parse(forecast))
  ));
