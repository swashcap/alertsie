'use strict';

module.exports.get = (request, reply) => request.server.inject('/api/sample')
  .then(response => reply.view('index', JSON.parse(response.payload)));
