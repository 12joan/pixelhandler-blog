/* jshint node: true */

module.exports = function(environment) {

  var ENV = {
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // LOG_MODULE_RESOLVER is needed for pre-1.6.0
    ENV.LOG_MODULE_RESOLVER = true;

    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_MODULE_RESOLVER = false;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.API_HOST = '';
    ENV.API_PATH = null;
    ENV.SOCKET_URL = "http://localhost:8888";
    ENV.GOOGLE_ANALYTICS = null;
  }

  if (environment === 'production') {
    ENV.API_HOST = "http://pixelhandler.com";
    ENV.API_PATH = "api";
    ENV.SOCKET_URL = "http://pixelhandler.com";
    ENV.GOOGLE_ANALYTICS = "UA-2687872-1";
  }

  return ENV;
};
