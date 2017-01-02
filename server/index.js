'use strict';

const handlebars = require('handlebars');
const hapi = require('hapi');
const path = require('path');

const routes = require('./routes/index.js');
const registerPlugins = require('./register-plugins.js');

const server = new hapi.Server();

server.connection({
  port: 3000,
});

registerPlugins(server);

server.route(routes);

server.start((error) => {
  if (error) {
    throw error;
  }

  server.views({
    engines: {
      html: handlebars,
    },
    path: path.join(__dirname, 'views'),
  });

  server.log('info', `Server running at ${server.info.uri}`);
});

