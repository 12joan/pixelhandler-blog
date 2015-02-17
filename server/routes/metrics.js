/**
  @module app
  @submodule routes/metrics
  @requires app, rethinkdb_adapter
**/
var loginfo = require('debug')('app:info');
var logerror = require('debug')('app:error');
var node_env = process.env.NODE_ENV || 'development';
var db = require('rethinkdb_adapter');
var metrics = require('../lib/metrics');
var crypto = require('crypto');

/**
  Exports {Function} routes for Metrics resource

  @main routes/metrics
  @param {Object} app - express application instance
**/
module.exports = function(app) {

  /**
    Create an metric resource

    Route: (verb) POST /metrics
    @async
  **/
  app.post('/metrics', function (req, res) {
    var metrics = req.body.metrics;
    if (!validPayload(metrics)) {
      logerror('Error on Post /metrics req.body.metrics invalid', req.body.metrics);
      res.sendStatus(422);
    }
    metrics.remoteAddress = req.ip;
    metrics.userAgent = req.headers['user-agent'];
    metrics.visit = crypto.createHash('sha256').update(metrics.visitor + req.ip).digest('hex');
    db.createRecord('metrics', metrics, function (err, payload) {
      if (err) {
        logerror(err);
        res.sendStatus(500);
      } else {
        res.status(201).send(payload);
      }
    });
  });

  var validPayload = function(payload) {
    var attrs = [
      'date','name','pathname','startTime','duration','screenWidth','screenHeight',
      'screenColorDepth','screenPixelDepth','screenOrientation','blogVersion',
      'emberVersion','adapterType','visitor'
    ];
    for (var prop in payload) {
      if (payload.hasOwnProperty(prop)) {
        if (attrs.indexOf(prop) === -1) {
          return false;
        }
      }
    }
    return true;
  };

  var formatMetrics = function(payload) {
    for (var i = 0; i < payload.metrics.length; i++) {
      for (var prop in payload.metrics[i]) {
        if (payload.metrics[i].hasOwnProperty(prop) && prop === 'remoteAddress' ) {
          delete payload.metrics[i][prop];
        }
      }
    }
    return payload;
  };

  /**
    (Read) Find raw metrics, accepts query object

    Route: (verb) GET /metrics/
    @async
  **/
  app.get('/metrics', function (req, res) {
    var query = queryFactory(req.query);
    metrics.findQuery('metrics', query, function (err, payload) {
      if (err) {
        logerror(err);
        res.sendStatus(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(formatMetrics(payload));
      }
    });
  });

  /**
    (Read) Find impressions metrics, defaults to 24 hrs timespan

    Route: (verb) GET /metrics/impressions
    @async
  **/
  app.get('/metrics/impressions', function (req, res) {
    req.query.seconds = req.query.seconds || 60 * 60 * 24; // 1 day default
    req.query.sortBy = req.query.sortBy || 'pathname';
    metrics.impressions(queryFactory(req.query), function (err, payload) {
      if (err) {
        logerror(err);
        res.sendStatus(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });


  /**
    (Read) Find duration metrics

    Route: (verb) GET /metrics/durations
    @async
  **/
  app.get('/metrics/durations', function (req, res) {
    req.query.seconds = req.query.seconds || 60 * 60 * 24 * 365; // 1 year default
    req.query.sortBy = req.query.sortBy || 'pathname';
    metrics.durations(queryFactory(req.query), function (err, payload) {
      if (err) {
        logerror(err);
        res.sendStatus(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });

};

/**
  @method queryFactory
  @param {Object} query
  @return {Object} query - with defaults and number strings converted
**/
function queryFactory(query) {
  var max = (query.limit) ? parseInt(query.limit, 10) : null;
  query.limit = (max && max < 1000) ? max : 1000;
  query.offset = (query.offset)? parseInt(query.offset, 10) : 0;
  query.sortBy = query.sortBy || 'date';
  query.order = query.order || 'desc';
  return query;
}