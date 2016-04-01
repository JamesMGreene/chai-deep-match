// Node.js core modules
var path = require('path');

// Userland modules
var grunt = require('grunt');



var uninstrumentedRootDir = path.resolve( __dirname, '../..' );

function _mapModuleName( moduleName ) {
  return require.resolve( path.resolve( uninstrumentedRootDir, moduleName ) );
}

var srcGlobPattern = grunt.config.get( 'not_constantinople.coverage.options.directories.sourceFiles' );
var testGlobPattern = grunt.config.get( 'mochaTest.spec.src' );
var allLocalFilesGlobPattern = srcGlobPattern.concat( testGlobPattern );
var allLocalFiles = grunt.file.expand( { cwd: uninstrumentedRootDir }, allLocalFilesGlobPattern );


allLocalFiles
  .map( _mapModuleName )
  .forEach(function( file ) {
    delete require.cache[ file ];
  });
