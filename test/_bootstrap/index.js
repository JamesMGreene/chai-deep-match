// Node.js core modules
var path = require('path');

// Userland modules
var rrd = require('recursive-readdir-sync');




var _preLoadModules = [
      'require-cache-clear',
      'require-cache-override',
      'global-expect'
    ];

var _postLoadModules = [
      'include-all-sources'
    ];


function _mapModuleName( moduleName ) {
  return require.resolve( path.resolve( __dirname, moduleName ) );
}

function _requireFile( filePath ) {
  require( filePath );
}


_preLoadModules
  .map( _mapModuleName )
  .forEach( _requireFile );

rrd( __dirname )
  .filter(function( filePath ) {
    var relativeBasename = path.basename( path.relative( __dirname, filePath ), '.js' );
    return (
      filePath !== __filename &&
      _preLoadModules.indexOf( relativeBasename ) !== -1 &&
      _postLoadModules.indexOf( relativeBasename ) !== -1
    );
  })
  .forEach( _requireFile );

_postLoadModules
  .map( _mapModuleName )
  .forEach( _requireFile );
