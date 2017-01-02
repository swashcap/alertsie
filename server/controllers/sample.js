'use strict';

const fs = require('fs');
const path = require('path');

module.exports.get = (request, reply) => reply(fs.createReadStream(
  path.resolve(__dirname, '../../test/response-stub.json')
));
