'use strict';

const handlebars = require('handlebars');
const marked = require('marked');
const moment = require('moment');
const sentenceCase = require('sentence-case');

module.exports = function loadHandlebarsHelpers() {
  handlebars.registerHelper(
    'markdown',
    t => new handlebars.SafeString(marked(sentenceCase(t)))
  );
  handlebars.registerHelper(
    'dayOfWeek',
    t => moment(t * 1000).format('dd')
  );
  handlebars.registerHelper(
    'toJSON',
    d => new handlebars.SafeString(JSON.stringify(d))
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
    'round',
    (n, options) => {
      const multiplier = Math.pow(10, options.hash.precision || 0);
      return Math.round(n * multiplier) / multiplier;
    }
  );
};
