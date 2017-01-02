'use strict';

const good = require('good');
const inert = require('inert');
const vision = require('vision');

module.exports = function registerPlugins(server) {
  server.register({
    register: good,
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              response: '*',
              log: '*',
            }],
          },
          {
            module: 'good-console',
          },
          'stdout',
        ],
      },
    },
  });

  /**
   * {@link https://hapijs.com/tutorials/serving-files}
   */
  server.register(inert);

  server.register(vision);
};

