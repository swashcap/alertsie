'use strict';

module.exports.get = ({ server }, reply) =>
  server.inject('/api/sample')
    .then(response => reply.view('index', JSON.parse(response.payload)));
