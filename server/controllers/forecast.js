'use strict';

const boom = require('boom');
const concatStream = require('concat-stream');
const https = require('https');
const zlib = require('zlib');

const { apiKey, latitude, longitude } = require('../utils/config.js');

module.exports.get = (request, reply) => {
  /**
   * Use Node.js's built-in `https#get` to get forecast info.
   * {@link https://nodejs.org/api/http.html#http_http_get_options_callback}
   * {@link
   * https://nodejs.org/api/zlib.html#zlib_compressing_http_requests_and_responses}
   */
  const req = https.get({
    headers: {
      'Accept-Encoding': 'gzip,deflate',
    },
    host: 'api.darksky.net',
    path: `forecast/${apiKey}/${latitude},${longitude}`,
  });

  req.on('response', (res) => {
    const {
      'content-encoding': contentEncoding,
      'content-type': contentType,
      statusCode,
    } = res;
    let error;

    if (statusCode !== 200) {
      error = new Error(
        `Forecast request failed with status code: ${statusCode}`
      );
    } else if (/^application\/json/.test(contentType)) {
      error = new Error(
        `Forecast response with content-type: ${contentType}`
      );
    }

    if (error) {
      request.server.log('error', error);
      res.resume();
      reply(boom.wrap(error));
    } else {
      res.setEncoding('utf8');

      const doReply = concatStream((rawData) => {
        try {
          reply(JSON.parse(rawData));
        } catch (err) {
          request.server.log('error', err);
          reply(boom.wrap(err));
        }
      });

      switch (contentEncoding) {
        case 'gzip':
          res.pipe(zlib.createGunzip()).pipe(doReply);
          break;
        case 'deflate':
          res.pipe(zlib.createInflate()).pipe(doReply);
          break;
        default:
          res.pipe(doReply);
          break;
      }
    }
  });

  request.on('error', (error) => {
    reply(boom.wrap(error));
  });
};
