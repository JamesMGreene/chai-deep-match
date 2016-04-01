// Node.js core modules
var Module = require('module');
var fs = require('fs');
var path = require('path');

// Userland modules
var grunt = require('grunt');



var uninstrumentedRootDir = path.resolve( __dirname, '../..' );
var rootDir = path.resolve( process.env.SOURCE_ROOT_DIR || uninstrumentedRootDir );

var isRunningCoverage = uninstrumentedRootDir !== rootDir;


var uninstrumentablePathPrefixes = [ '..', 'node_modules', 'test', 'dist' ];

var srcGlobPattern = grunt.config.get( 'not_constantinople.coverage.options.directories.sourceFiles' );
var instrumentableSrcFiles = !srcGlobPattern ? [] :
      grunt.file.expand(
        {
          cwd: uninstrumentedRootDir
        },
        srcGlobPattern
      )
      .map(function( relativeFilePath ) {
        return path.resolve( uninstrumentedRootDir, relativeFilePath );
      });


function convertSrcFilePathToInstrumentedSrcFilePath( srcFullPath ) {
  var srcRelativePathToUninstrumentedRootDir = path.relative( uninstrumentedRootDir, srcFullPath );

  var firstDir = srcRelativePathToUninstrumentedRootDir.split( /[\/\\]/g, 1 );

  if ( uninstrumentablePathPrefixes.indexOf( firstDir ) === -1 ) {
    srcFullPath = path.resolve( rootDir, srcRelativePathToUninstrumentedRootDir );
  }

  return srcFullPath;
}


var originalJsLoader = Module._extensions['.js'];

Module._extensions['.js'] = function( module, filename ) {
  if ( isRunningCoverage && instrumentableSrcFiles.indexOf( filename ) !== -1 ) {
    var instrumentedFilename = convertSrcFilePathToInstrumentedSrcFilePath( filename );
    if ( filename !== instrumentedFilename ) {
      var instrumentedCode = fs.readFileSync( instrumentedFilename, 'utf8' );

      // Register the instrumented file as itself
      module._compile( instrumentedCode, instrumentedFilename );

      // Register the instrumented file as the non-instrumented file
      module._compile( instrumentedCode, filename );

      return;
    }
  }

  // Otherwise load it as normal...
  originalJsLoader( module, filename );
};
