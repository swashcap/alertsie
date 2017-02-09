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

function formatTick(x) {
  return moment(x).toNow(true);
};

alertsie.minutely.forEach(function mapData(d) {
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

var tempColumns = alertsie.hourly.reduce(function hourlyData(memo, data) {
  var times = memo[0];
  var time = data.time * 1000;
  var index = times.findIndex(function findTime(t) {
    return t > time;
  });

  if (index === -1) {
    index = times.length;
  } else {
    index -= 1;
  }

  times.splice(index, 0, time);
  memo[1].splice(index, 0, data.temperature);

  return memo;
}, [['x'], ['temp']]);

docReady(function onDocReady() {
  var precipChart = c3.generate({
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          count: 5,
          format: formatTick,
        },
      },
      y: {
        show: false,
      },
    },
    bindto: document.getElementById('chart'),
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

  var tempChart = c3.generate({
    axis: {
      x: {
        tick: {
          count: 6,
          format: formatTick,
        },
        type: 'timeseries',
      },
      y: {
        tick: {
          format: function formatTemp(y) {
            return y + '°F';
          },
        },
      },
    },
    bindto: document.getElementById('tempchart'),
    data: {
      columns: tempColumns,
      type: 'spline',
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

