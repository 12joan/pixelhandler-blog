# Pixelhandler's Blog

* [Pixelhandler.com](http://pixelhandler.com)
* (Local) server runs on port 8888, client on 8000 (in dev, uses ember-cli proxy helper to access api on same domain)

[![Code Climate](https://codeclimate.com/github/pixelhandler/blog.png)](https://codeclimate.com/github/pixelhandler/blog)

## Directories

### [client](client)

* See: [client/README.md](client/README.md), [client/package.json](client/package.json),  [client/bower.json](client/bower.json)

### [server](server)

* See: [server/README.md](server/README.md), [server/package.json](server/package.json)

## Setup

* `cd client && npm install && bower install`
* `cd server && npm install`

## Tasks / Commands

### Client-side

* See [client/Makefile](client/Makefile)

`cd client`, then watch, build and reload using `make server`

### Server-side

* See the [server/Makefile](server/Makefile)

`cd server`, `make db`, `make server`

