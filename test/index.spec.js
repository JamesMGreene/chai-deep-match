/*global describe, context, it, chai, expect */

// Local modules
var chaiDeepMatch = require('..');


var deepObj = {
      a: {
        b: {
          c: 'foo'
        },
        d: 'bar'
      },
      e: 'baz'
    };



describe( 'chai-deep-match', function() {

  it( 'should not automatically plug into chai', function() {
    expect( 'awesome stringification' ).to.match( /some string/ );
    expect( 'awesome stringification' ).to.deep.match( /some string/ );
    expect( function() { expect( deepObj ).to.match( deepObj ); } ).to.throw( TypeError, /re\.exec is not a function/ );
    expect( function() { expect( deepObj ).to.match( { e: 'baz' } ); } ).to.throw( TypeError, /re\.exec is not a function/ );
    expect( function() { expect( deepObj ).to.deep.match( deepObj ); } ).to.throw( TypeError, /re\.exec is not a function/ );
    expect( function() { expect( deepObj ).to.deep.match( { e: 'baz' } ); } ).to.throw( TypeError, /re\.exec is not a function/ );
  });


  context( 'when used as a chai plugin', function() {

    it( 'should be manually pluggable into lodash', function() {
      // Act
      chai.use( chaiDeepMatch );

      // Assert
      expect( 'awesome stringification' ).to.match( /some string/ );
      expect( 'awesome stringification' ).to.deep.match( /some string/ );
      expect( function() { expect( deepObj ).to.match( deepObj ); } ).to.throw( TypeError, /re\.exec is not a function/ );
      expect( function() { expect( deepObj ).to.match( { e: 'baz' } ); } ).to.throw( TypeError, /re\.exec is not a function/ );
      expect( function() { expect( deepObj ).to.deep.match( deepObj ); } ).to.not.throw( TypeError, /re\.exec is not a function/ );
      expect( function() { expect( deepObj ).to.deep.match( { e: 'baz' } ); } ).to.not.throw( TypeError, /re\.exec is not a function/ );
    });

    it( 'should not interfere with the non-deep `match` assertion', function() {
      expect( 'awesome stringification' ).to.match( /some string/ );
      expect( function() { expect( deepObj ).to.match( deepObj ); } ).to.throw( TypeError, /re\.exec is not a function/ );
      expect( function() { expect( deepObj ).to.match( { e: 'baz' } ); } ).to.throw( TypeError, /re\.exec is not a function/ );
    });

    it( 'should not interfere with the former deep `match` assertion behavior (which ignores "deep") if the second argument is a RegExp', function() {
      expect( 'awesome stringification' ).to.deep.match( /some string/ );
    });

    it( 'should deeply match `null` to `null`', function() {
      expect( null ).to.deep.match( null );
    });

    it( 'should deeply match equivalent objects', function() {
      expect( deepObj ).to.deep.match( deepObj );
    });

    it( 'should deeply match equivalent subsets of objects', function() {
      expect( deepObj ).to.deep.match( { e: 'baz' } );
    });

    it( 'should accept a custom "message" argument', function() {
      expect( deepObj ).to.deep.match( { e: 'baz' }, 'My custom message' );
      expect( function() { expect( deepObj ).to.deep.match( { bad: 'nomatch' }, 'My custom error' ); } ).to.throw( Error, /My custom error/ );
    });

  });

});

