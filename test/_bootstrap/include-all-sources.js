// Node.js core modules
var path = require('path');

// Userland modules
var grunt = require('grunt');



var rootDir = process.env.SOURCE_ROOT_DIR || path.resolve( __dirname, '../..' );

var srcGlobPattern = grunt.config.get('not_constantinople.coverage.options.directories.sourceFiles');
var srcFiles =
      grunt.file.expand(
        {
          cwd: rootDir
        },
        srcGlobPattern
        )
        .map(function( relativeFilePath ) {
          return path.resolve( rootDir, relativeFilePath );
        });

srcFiles
  .forEach(function( filePath ) {
    require( filePath );
  });
