'use strict';

const address = require('../../server/controllers/address.js');
const mockery = require('mockery');
const sinon = require('sinon');
const tape = require('tape');
const reverseGeocodingStub = require('../stubs/reverse-geocoding.json');

tape('address :: get', (t) => {
  const makeRequestStub = sinon.stub()
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

  mockery.registerMock(
    '../../server/utils/make-request.js',
    makeRequestStub
  );
  const teardown = () => mockery.deregisterMock('../../server/utils/make-request.js');

  address.get(request, replySpy)
    .then((response) => {
      if (response.isBoom) {
        console.log(makeRequestStub.called);
        debugger;
        throw response;
      }
    })
    .catch(t.end)
    .then(teardown, teardown);
});
