'use strict';

const boom = require('boom');
const fs = require('fs');
const path = require('path');
const pify = require('pify');

const forecast = require('../controllers/forecast.js');

const stat = pify(fs.stat);

module.exports = [{
  method: 'GET',
  path: '/',
  handler(request, reply) {
    return request.server.inject('/api/sample')
      .then(response => reply.view('index', JSON.parse(response.payload)));
  },
}, {
  method: 'GET',
  path: '/api/forecast',
  // handler: forecast.get,
  handler(request, reply) {
    reply('disabled');
  },
}, {
  method: 'GET',
  path: '/api/sample',
  handler(request, reply) {
    return reply(fs.createReadStream(
      path.resolve(__dirname, '../../test/response-stub.json')
    ));
  },
}, {
  method: 'GET',
  path: '/{file*}',
  handler(
    {
      params: { file },
    },
    reply
  ) {
    const path1 = path.resolve(__dirname, `../../.tmp/${file}`);
    const path2 = path.resolve(__dirname, `../../public/${file}`);

    return stat(path1)
      .then(() => reply.file(path1))
      .catch(() => stat(path2).then(() => reply.file(path2)))
      .catch(() => reply(boom.notFound()));
  },
}];

