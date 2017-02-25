'use strict';

const concatStream = require('concat-stream');
const https = require('https');
const zlib = require('zlib');

module.exports = {
  /**
   * Use Node.js's built-in `https#get` to get forecast info.
   * {@link https://nodejs.org/api/http.html#http_http_get_options_callback}
   * {@link https://nodejs.org/api/zlib.html#zlib_compressing_http_requests_and_responses}
   */
  get(options) {
    return new Promise((resolve, reject) => {
      const req = https.get(options);

      req.on('response', (res) => {
        const {
          headers: {
            'content-encoding': contentEncoding,
            'content-type': contentType,
          },
          statusCode,
        } = res;
        let error;

        if (statusCode !== 200) {
          error = new Error(
            `Request failed with status code: ${statusCode}`
          );
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            `Response with content-type: ${contentType}`
          );
        }

        if (error) {
          res.resume();
          reject(error);
        } else {
          const doReply = concatStream((rawData) => {
            try {
              resolve(JSON.parse(
                Buffer.isBuffer(rawData) ? rawData.toString() : rawData
              ));
            } catch (err) {
              reject(err);
            }
          });

          if (contentEncoding === 'gzip') {
            const gunzip = zlib.createGunzip();
            gunzip.on('error', reject);
            res.pipe(gunzip).pipe(doReply);
          } else if (contentEncoding === 'deflate') {
            const inflate = zlib.createInflat();
            inflate.on('error', reject);
            res.pipe(inflate).pipe(doReply);
          } else {
            res.pipe(doReply);
          }
        }
      });

      req.on('error', reject);
    });
  },
};

