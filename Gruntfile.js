// Node.js core modules
var path = require('path');


module.exports = function( grunt ) {
  /*jshint camelcase:false */

  var _coverageMinimum = 70;
  var _coverageGoal = 90;


  // Project configuration.
  grunt.initConfig({

    // Metadata.

    pkg: require( './package.json' ),

    coverageDir: '<%= not_constantinople.coverage.options.directories.root %>/<%= not_constantinople.coverage.options.directories.coverage %>',


    // Task configuration.

    env: {
      options: {

      },
      test: {
        SOURCE_ROOT_DIR: __dirname
      },
      coverage: {
        SOURCE_ROOT_DIR:
          path.resolve(
            __dirname,
            '<%= coverageDir %>/instrument'
          )
      }
    },

    clean: {
      coverage: [ '<%= coverageDir %>/' ]
    },

    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: [ 'Gruntfile.js' ],
      src: [ 'index.js', 'src/**/*.js', 'lib/**/*.js' ],
      test: [ 'test/**/*.js', '!<%= coverageDir %>/**' ]
    },

    mochaTest: {
      options: {
        //reporter: 'spec',
        //captureFile: 'results.txt',  // Optionally capture the reporter output to a file
        //quiet: false,                // Optionally suppress output to standard out (defaults to `false`)
        //clearRequireCache: false,    // Optionally clear the require cache before running tests (defaults to `false`)

        // Mocha core options
        require: [ './test/_bootstrap' ]
      },
      spec: {
        options: {
          reporter: 'spec'
        },
        src: [ 'test/**/*.spec.js', '!<%= coverageDir %>/**' ]
      }
    },

    not_constantinople: {
      coverage: {
        options: {
          // REQUIRED OPTION - This should be the task that runs your unit tests (e.g. 'mochaTest', 'nodeunit:myTests', etc.).
          unitTestTask: 'mochaTest',
          // Directory names to be used for your tests and coverage.
          directories: {
            root: 'test',
            coverage: '__coverage',
            sourceFiles: [ 'index.js', 'src/**/*.js', 'lib/**/*.js' ]
          },
          // Coverage thresholds. Set to `false` to ignore thresholds.
          thresholds: {
            statements: _coverageMinimum,
            branches:   _coverageMinimum,
            lines:      _coverageMinimum,
            functions:  _coverageMinimum
          },
          // The format of the coverage reports.
          report: {
            type: 'lcov',
            print: 'detail'
          },
          // Removes the contents of the coverage folder before running Istanbul.
          cleanup: true,
          reportingOptions: {
            watermarks: {
              statements: [ _coverageMinimum, _coverageGoal ],
              branches:   [ _coverageMinimum, _coverageGoal ],
              lines:      [ _coverageMinimum, _coverageGoal ],
              functions:  [ _coverageMinimum, _coverageGoal ]
            }
          }
        }
      }
    },

    coveralls: {
      report: {
        src: '<%= coverageDir %>/reports/lcov.info'
      }
    },

    open: {
      /*
       NOTE: The `htmlcov` target is only here for IF you need/want to view the
       coverage result details! To do so, run `grunt showcov` or `grunt open:htmlcov`
       */
      htmlcov: {
        path: '<%= coverageDir %>/reports/lcov-report/index.html'
      }
    }

  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-not-constantinople');
  grunt.loadNpmTasks('grunt-open');


  // Default task.
  grunt.registerTask( 'default', [ 'env:test', 'clean', 'jshint', 'mochaTest' ] );

  // Local coverage task.
  grunt.registerTask( 'cov', [ 'env:coverage', 'jshint', 'not_constantinople' ] );

  // Special task to view HTML coverage results locally.
  grunt.registerTask( 'showcov', [ 'open:htmlcov' ] );

  // Travis CI task.
  grunt.registerTask( 'travis', [ 'cov', 'coveralls' ] );

};
