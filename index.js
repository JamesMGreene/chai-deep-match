// Userland modules
var _ = require('lodash');
var pickDeep = require('lodash-pickdeep');
var keysDeep = require('deep-keys');



module.exports = function( chai, util ) {

  var Assertion = chai.Assertion;


  Assertion.overwriteMethod( 'match', function( _super ) {

    function assertDeepMatch( val, msg ) {

      var actual = this._obj;
      var expected = val;

      var isDeep = !!util.flag( this, 'deep' );

      if ( isDeep && typeof actual === 'object' && typeof expected === 'object' && ( expected == null || !( expected instanceof RegExp ) ) ) {
        if ( msg ) {
          util.flag( this, 'message', msg );
        }

        var matchResult =
              ( actual == null && expected == null ) ||
              _.isEqual( actual, expected ) ||
              ( typeof actual === 'object' && typeof expected === 'object' && actual != null && expected != null && _.isMatch( actual, expected ) );

        this.assert(
          matchResult,
          'expected #{this} to deeply match #{exp}',
          'expected #{this} to deeply not match #{exp}',
          expected,
          actual == null ? actual : pickDeep( actual, keysDeep( expected ) ),
          true
        );
      }
      else {
        _super.apply( this, arguments );
      }

    }


    return assertDeepMatch;

  });

};
