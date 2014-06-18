var sysPath = require('path');

var environment = process.env.BRUNCH_ENV || 'development';

console.log('Running Brunch in '+ environment +' environment');

exports.config = {
  paths: {
    'public': 'public',
    watched: ['app', 'vendor/' + environment]
  },
  files: {
    javascripts: {
      defaultExtension: 'js',
      joinTo: {
        'app.js': /^app/,
        'env.js': /^app\/env\.js$/,
        'vendor.js': new RegExp('^vendor\/' + environment + '\/.+\.js$')
      },
      order: {
        before: [
          'app/env.js',
          'vendor/'+ environment +'/jquery.js',
          'vendor/'+ environment +'/handlebars.js',
          'vendor/'+ environment +'/ember.js',
          //'vendor/'+ environment +'/loader.js',
          //'vendor/'+ environment +'/orbit.js',
          //'vendor/'+ environment +'/orbit-common.js',
          //'vendor/'+ environment +'/orbit-common-jsonapi.js',
          //'vendor/'+ environment +'/ember-orbit.js',
          'app/app.js'
        ],
        after: [
          'app/init.js'
        ]
      }
    },
    stylesheets: {
      joinTo: {
        'stylesheets/normalize.css': new RegExp('vendor/'+ environment +'/normalize.css'),
        'stylesheets/app.css': /^app\/stylesheets\/(app|components|elements|utilities|fonts)\.css$/,
      }
    },
    templates: {
      precompile: true,
      root: 'templates/',
      defaultExtension: 'hbs',
      joinTo: 'app.js'
    }
  },
  conventions: {
    assets: /assets[\\/]/,
    ignored: /bower_components[\\/]/,
    vendor: /vendor[\\/]/
  },
  optimize: false,
  sourceMaps: true,
  plugins: {
    autoReload: {
      enabled: true
    }
  },
  server: {
    path: 'server.js',
    port: 8000
  },
  watcher: {
    usePolling: true
  },
  overrides: {
    production: {
      optimize: true,
      sourceMaps: false,
      files: {
        javascripts: {
          defaultExtension: 'js',
          joinTo: {
            'app.js': /^app/,
            'env.js': /^app\/env\.js$/,
            'vendor.js': new RegExp('^vendor\/' + environment)
          },
          order: {
            before: [
              'vendor/'+ environment +'/jquery.min.js',
              'vendor/'+ environment +'/handlebars.min.js',
              'vendor/'+ environment +'/ember.min.js',
              //'vendor/'+ environment +'/loader.js',
              //'vendor/'+ environment +'/orbit.amd.min.js',
              //'vendor/'+ environment +'/orbit-common.amd.min.js',
              //'vendor/'+ environment +'/orbit-common-jsonapi.amd.min.js',
              //'vendor/'+ environment +'/ember-orbit.amd.minjs',
              'app/app.js'
            ],
            after: [
              'app/init.js'
            ]
          }
        }
      },
      plugins: {
        autoReload: {
          enabled: false
        },
        cleancss: {
          keepSpecialComments: 1,
          removeEmpty: false
        }
      }
    }
  }
};
