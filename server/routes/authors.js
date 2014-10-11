/**
  @module app
  @submodule routes/authors
  @requires app, rethinkdb_adapter
**/
var debug = require('debug')('authors');
var node_env = process.env.NODE_ENV || 'development';
var db = require('../lib/rethinkdb_adapter');


/**
  Exports {Function} routes for Post resource

  @main routes/authors
  @param {Object} app - express application instance
  @param {Function} restrict - middleware, for protected routes
**/
module.exports = function(app, restrict) {

  /**
    Create an author

    Route: (verb) POST /authors
    @async
  **/
  app.post('/authors', restrict, function (req, res) {
    db.createRecord('authors', req.body.authors, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        res.status(201).send(payload);
      }
    });
  });

  /**
    Create a post link on an author

    Route: (verb) POST /authors/:id/links/posts
    @async
  **/
  app.post('/authors/:id/links/posts', restrict, function (req, res) {
    debug('/authors/:id/links/posts', req.params.id, req.body);
    var id = req.params.id;
    db.find('authors', id, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        var postId = req.body.posts;
        payload.authors.links.posts.push(postId);
        debug('update author', payload);
        db.updateRecord('authors', id, payload.authors, function (err) {
          if (err) {
            debug(err);
            res.status(500).end();
          } else {
            if (app._io) {
              var payload = { 'authors': req.body };
              debug('didAddLink', payload);
              app._io.emit('didAddLink', payload);
            }
            res.status(204).end(); // No Content
          }
        });
      }
    });
  });

  /**
    (Read) Find authors accepts query object

    Route: (verb) GET /authors
    @async
  **/
  app.get('/authors', function (req, res) {
    db.findQuery('authors', req.query, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });

  /**
    (Read) Find a post by id

    Route: (verb) GET /authors/:id
    @async
  **/
  app.get('/authors/:id', function (req, res) {
    db.find('authors', req.params.id, function (err, payload) {
      if (err) {
        debug(err);
        res.send(500);
      } else {
        if (node_env != 'development') {
          res.header('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
        }
        res.send(payload);
      }
    });
  });

  /**
    Update a post by id

    Route: (verb) PUT /authors/:id
    @async
  **/
  app.put('/authors/:id', restrict, function (req, res) {
    db.updateRecord('authors', req.params.id, req.body.authors, function (err) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        res.status(204).end();
      }
    });
  });

  /**
    Update a post link on an author

    Route: (verb) POST /authors/:id/links/posts
    @async
  **/
  app.put('/authors/:id/links/posts', restrict, function (req, res) {
    debug('/authors/:id/links/posts', req.params.id, req.body);
    var id = req.params.id;
    db.find('authors', id, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        var postId = req.body.posts;
        payload.authors.links.posts.push(postId);
        debug('update author', payload);
        db.updateRecord('authors', id, payload.authors, function (err) {
          if (err) {
            debug(err);
            res.status(500).end();
          } else {
            if (app._io) {
              var payload = { 'authors': req.body };
              debug('didAddLink', payload);
              app._io.emit('didAddLink', payload);
            }
            res.status(204).end(); // No Content
          }
        });
      }
    });
  });


  /**
    Patch a post by id

    Route: (verb) PATCH /authors/:id
    @async
  **/
  app.patch('/authors/:id', restrict, function (req, res) {
    db.patchRecord('authors', req.params.id, req.body, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        res.status(204).end();
      }
    });
  });


  /**
    Delete a post by id

    Route: (verb) DELETE /authors/:id
    @async
  **/
  app.delete('/authors/:id', restrict, function (req, res) {
    db.deleteRecord('authors', req.params.id, function (err) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        res.status(204).end(); // No Content
      }
    });
  });

  /**
    TODO Delete an post from an author

    Route: (verb) DELETE /posts/:id/links/author
    @async
  **/
  app.delete('/authors/:id/links/posts', restrict, function (req, res) {
    debug('/authors/:id/links/posts', req.params, req.body);
    var id = req.params.id;
    db.find('authors', id, function (err, payload) {
      if (err) {
        debug(err);
        res.status(500).end();
      } else {
        debug('author', payload);
        payload = { links: payload.authors.links };
        var index = payload.links.posts.indexOf(payload.id);
        if (index > -1) {
          payload.links.posts.splice(index, 1);
          db.updateRecord('authors', id, payload, function (err) {
            if (err) {
              debug(err);
              res.status(500).end();
            } else {
              if (app._io) {
                var payload = { authors: req.body };
                // TODO use patch format in payload ?
                debug('didRemoveLink', payload);
                app._io.emit('didRemoveLink', payload);
              }
              res.status(204).end(); // No Content
            }
          });
        }
      }
    });
  });

};
