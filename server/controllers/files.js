'use strict';

const boom = require('boom');
const fs = require('fs');
const path = require('path');
const pify = require('pify');

const stat = pify(fs.stat);


module.exports.get = (
  {
    params: { file },
  },
  reply
) => {
  const path1 = path.resolve(__dirname, `../../.tmp/${file}`);
  const path2 = path.resolve(__dirname, `../../public/${file}`);

  return stat(path1)
    .then(() => reply.file(path1))
    .catch(() => stat(path2).then(() => reply.file(path2)))
    .catch(() => reply(boom.notFound()));
};
