'use strict';

const handlebars = require('handlebars');
const hapi = require('hapi');
const path = require('path');

const loadHandlebarsHelpers = require('./utils/load-handlebars-helpers.js');
const loadPartials = require('./utils/load-partials.js');
const routes = require('./routes/index.js');
const registerPlugins = require('./utils/register-plugins.js');

const server = new hapi.Server();

process.on('uncaughtException', (error) => {
  console.error(error); // eslint-disable-line no-console
  process.exit(1);
});

/**
 * Consider unhandled rejects as errors.
 *
 * {@link https://nodejs.org/api/process.html#process_event_unhandledrejection}
 */
process.on('unhandledRejection', (reason, p) => {
  /* eslint-disable no-console */
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  /* eslint-enable no-console */
  process.exit(1);
});

server.connection({
  port: 3000,
});

registerPlugins(server);

server.route(routes);

loadHandlebarsHelpers();

loadPartials()
  .then(() => server.start())
  .then(() => {
    server.views({
      engines: {
        html: handlebars,
      },
      path: path.join(__dirname, 'views'),
    });

    server.log('info', `Server running at ${server.info.uri}`);
  });
