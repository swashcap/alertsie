'use strict';

const sinon = require('sinon');
const tape = require('tape');

const address = require('../../server/controllers/address.js');
const makeRequest = require('../../server/utils/make-request.js');
const reverseGeocodingStub = require('../stubs/reverse-geocoding.json');

tape('address :: get', (t) => {
  const makeRequestStub = sinon.stub(makeRequest, 'get')
    .returns(Promise.resolve(reverseGeocodingStub));
  const request = {
    params: {
      apiKey: 'testAPIKey',
      latitude: 43.8,
      longitude: 120.5,
    },
    server: {
      log: sinon.spy(),
    },
  };
  const replySpy = sinon.spy();

  t.plan(2);

  address.get(request, replySpy)
    .then((response) => {
      if (response && response.isBoom) {
        throw response;
      }

      t.equal(replySpy.callCount, 1, 'calls reply');
      t.deepEqual(
        replySpy.firstCall.args[0],
        {
          administrativeAreaLevel1:
            reverseGeocodingStub.results[0].address_components[5].long_name,
          sublocality:
            reverseGeocodingStub.results[0].address_components[3].long_name,
        },
        'modifies geojson API response'
      );
    })
    .catch(t.end)
    .then(makeRequestStub.restore, makeRequestStub.restore);
});

