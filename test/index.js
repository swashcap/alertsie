'use strict';

const mockery = require('mockery');


mockery.enable({
  warnOnUnregistered: false,
  // useCleanCache: true,
});

require('./controllers/address.js');

mockery.disable();

