'use strict';

/* global alertsie,document */

var c3 = require('c3');
var docReady = require('doc-ready');
var moment = require('moment');

var columns = [
  ['rain'],
  ['sleet'],
  ['snow'],
  ['x'],
];

var columnType = columns.reduce(function toColumnType(memo, column, index) {
  memo[column[0]] = index;
  return memo;
}, {});

var chart;

alertsie.data.forEach(function mapData(d) {
  var type = d.precipType;
  var x = columns[columnType.x];
  var xLength = x.push(d.time * 1000);

  if (d.precipIntensity && type) {
    columns[columnType[type]].push(d.precipIntensity);
  }

  columns.slice(0, 3).forEach(function padColumn(column) {
    if (column.length < xLength) {
      column.push(0);
    }
  });
});

docReady(function onDocReady() {
  chart = c3.generate({
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          count: 5,
          format: function formatTick(x) {
            return moment(x).toNow(true);
          },
        },
      },
      y: {
        show: false,
      },
    },
    bindTo: '#chart',
    data: {
      colors: {
        rain: '#ffffff',
      },
      columns: columns,
      type: 'area-spline',
      x: 'x',
    },
    legend: {
      hide: true,
    }, 
    point: {
      show: false,
    },
    tooltip: {
      show: false,
    },
  });
});

