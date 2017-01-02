'use strict';

const fs = require('fs');
const good = require('good');
const handlebars = require('handlebars');
const inert = require('inert');
const marked = require('marked');
const moment = require('moment');
const path = require('path');
const sentenceCase = require('sentence-case');
const vision = require('vision');

function registerPartial(name) {
  const file = fs.readFileSync(path.resolve(__dirname, `views/${name}.html`));

  return handlebars.registerPartial(name, file.toString());
}

registerPartial('alert');
registerPartial('currently');
registerPartial('week');

handlebars.registerHelper(
  'markdown',
  t => new handlebars.SafeString(marked(sentenceCase(t)))
);
handlebars.registerHelper(
  'dayOfWeek',
  t => moment(t * 1000).format('dd')
);
handlebars.registerHelper(
  'timeToISO',
  t => moment(t * 1000).format()
);
handlebars.registerHelper(
  'timeFromNow',
  t => moment(t * 1000).from()
);
handlebars.registerHelper(
  'temp',
  t => new handlebars.SafeString(`${Math.round(t * 10) / 10}<span>°F</span>`)
);

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

