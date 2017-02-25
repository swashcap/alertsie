'use strict';

const boom = require('boom');
const makeRequest = require('../utils/make-request.js');

module.exports.get = (
  {
    params: {
      apiKey,
      latitude,
      longitude,
    },
    server,
  },
  reply
) => makeRequest.get({
  host: 'maps.google.com',
  path: `/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
})
  .then(({ results: [{ address_components: addressComponents }] }) => reply(
    /**
     * Do some response manglin'.
     * {@link https://developers.google.com/maps/documentation/geocoding/intro#reverse-example}
     */
    addressComponents.reduce((memo, item) => {
      /* eslint-disable no-param-reassign */
      if (item.types.indexOf('sublocality') > -1) {
        memo.sublocality = item.long_name;
      } else if (item.types.indexOf('administrative_area_level_1') > -1) {
        memo.administrativeAreaLevel1 = item.long_name;
      }
      /* eslint-enable no-param-reassign */

      return memo;
    }, {})
  ))
  .catch((error) => {
    server.log('error', error.message);
    return boom.wrap(error);
  });

