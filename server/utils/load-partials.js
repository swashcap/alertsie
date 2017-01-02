'use strict';

const fs = require('fs');
const glob = require('glob');
const handlebars = require('handlebars');
const path = require('path');
const pify = require('pify');

const readFile = pify(fs.readFile);

const EXT = '.hbs';

// Load all partials
module.exports = function loadPartials() {
  return pify(glob)(`${path.resolve(__dirname, '../../components/')}/*${EXT}`)
    .then(files => Promise.all([files].concat(files.map(f => readFile(f)))))
    .then(([files, ...datas]) => files.map((file, index) =>
      handlebars.registerPartial(path.basename(file, EXT), datas[index].toString())
    ));
};
