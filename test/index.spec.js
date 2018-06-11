/*global describe, context, it, chai, expect */

// Node.js core modules
var url = require('url');

// Local modules
var chaiDeepMatch = require('..');


// Node.js >= 7.x
var URL = global.URL || url.URL;

var deepObj = {
      a: {
        b: {
          c: 'foo'
        },
        d: 'bar'
      },
      e: 'baz'
    };

// Node 4.x & 5.x: "re.exec is not a function"
// Node 12.x: "undefined is not a function"
// Node 10.x: "Object #<Object> has no method 'exec'"
var mismatchedMatchRegex = /(?:(?:re\.exec|undefined) is not a function|Object #<Object> has no method 'exec')/;



describe( 'chai-deep-match', function() {

  it( 'should not automatically plug into chai', function() {
    expect( 'awesome stringification' ).to.match( /some string/ );
    expect( 'awesome stringification' ).to.deep.match( /some string/ );
    expect( function() { expect( deepObj ).to.match( deepObj ); } ).to.throw( TypeError, mismatchedMatchRegex );
    expect( function() { expect( deepObj ).to.match( { e: 'baz' } ); } ).to.throw( TypeError, mismatchedMatchRegex );
    expect( function() { expect( deepObj ).to.deep.match( deepObj ); } ).to.throw( TypeError, mismatchedMatchRegex );
    expect( function() { expect( deepObj ).to.deep.match( { e: 'baz' } ); } ).to.throw( TypeError, mismatchedMatchRegex );
  });


  context( 'when used as a chai plugin', function() {

    it( 'should be manually pluggable into lodash', function() {
      // Act
      chai.use( chaiDeepMatch );

      // Assert
      expect( 'awesome stringification' ).to.match( /some string/ );
      expect( 'awesome stringification' ).to.deep.match( /some string/ );
      expect( function() { expect( deepObj ).to.match( deepObj ); } ).to.throw( TypeError, mismatchedMatchRegex );
      expect( function() { expect( deepObj ).to.match( { e: 'baz' } ); } ).to.throw( TypeError, mismatchedMatchRegex );
      expect( function() { expect( deepObj ).to.deep.match( deepObj ); } ).to.not.throw( TypeError, mismatchedMatchRegex );
      expect( function() { expect( deepObj ).to.deep.match( { e: 'baz' } ); } ).to.not.throw( TypeError, mismatchedMatchRegex );
    });

    it( 'should not interfere with the non-deep `match` assertion', function() {
      expect( 'awesome stringification' ).to.match( /some string/ );
      expect( function() { expect( deepObj ).to.match( deepObj ); } ).to.throw( TypeError, mismatchedMatchRegex );
      expect( function() { expect( deepObj ).to.match( { e: 'baz' } ); } ).to.throw( TypeError, mismatchedMatchRegex );
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

    it( 'should not deeply match unequivalent subsets of objects', function() {
      expect( deepObj ).to.not.deep.match( { e: 'foo' } );
    });

    it( 'should accept a custom "message" argument', function() {
      expect( deepObj ).to.deep.match( { e: 'baz' }, 'My custom message' );
      expect( function() { expect( deepObj ).to.deep.match( { bad: 'nomatch' }, 'My custom error' ); } ).to.throw( Error, /My custom error/ );
    });


    // IMPORTANT:
    // Skip all tests within this suite if the native URL type is not supported
    ( !URL ? describe.skip : describe )( 'Node.js >= 7.x URLs', function() {

      it( 'should work for basic URLs', function() {
        var urlString = 'http://domain.com/';
        var url1 = new URL( urlString );
        var url2 = new URL( urlString );

        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs on equivalent implicit ports for ftp', function() {
        var url1 = new URL( 'ftp://domain.com/' );
        var url2 = new URL( 'ftp://domain.com:21/' );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs on equivalent implicit ports for gopher', function() {
        var url1 = new URL( 'gopher://domain.com/' );
        var url2 = new URL( 'gopher://domain.com:70/' );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs on equivalent implicit ports for http', function() {
        var url1 = new URL( 'http://domain.com/' );
        var url2 = new URL( 'http://domain.com:80/' );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs on equivalent implicit ports for https', function() {
        var url1 = new URL( 'https://domain.com/' );
        var url2 = new URL( 'https://domain.com:443/' );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs on equivalent implicit ports for ws', function() {
        var url1 = new URL( 'ws://domain.com/' );
        var url2 = new URL( 'ws://domain.com:80/' );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs on equivalent implicit ports for wss', function() {
        var url1 = new URL( 'wss://domain.com/' );
        var url2 = new URL( 'wss://domain.com:443/' );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for URLs with equivalent query strings', function() {
        var urlString = 'http://domain.com/blah/';
        var queryString1 = '?a=b&c=d';
        var queryString2 = '?c=d&a=b';

        var url1 = new URL( urlString + queryString1 );
        var url2 = new URL( urlString + queryString1 );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );

        url1 = new URL( urlString + queryString1 );
        url2 = new URL( urlString + queryString2 );
        expect( url1 ).to.deep.match( url2 );
        expect( url2 ).to.deep.match( url1 );
        expect( { key: url1 } ).to.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.deep.match( { key: url1 } );
      });

      it( 'should work for unequivalent URLs', function() {
        var urlString = 'http://domain.com/blah/';
        var urlQueryString = '?a=b&c=d';
        var urlFragment = '#foo';

        var url1 = new URL( urlString );
        var url2 = new URL( urlString + urlQueryString );
        var url3 = new URL( urlString + urlFragment );
        var url4 = new URL( urlString + urlQueryString + urlFragment );

        expect( url1 ).to.not.deep.match( url2 );
        expect( url2 ).to.not.deep.match( url1 );
        expect( { key: url1 } ).to.not.deep.match( { key: url2 } );
        expect( { key: url2 } ).to.not.deep.match( { key: url1 } );

        expect( url1 ).to.not.deep.match( url3 );
        expect( url3 ).to.not.deep.match( url1 );
        expect( { key: url1 } ).to.not.deep.match( { key: url3 } );
        expect( { key: url3 } ).to.not.deep.match( { key: url1 } );

        expect( url1 ).to.not.deep.match( url4 );
        expect( url4 ).to.not.deep.match( url1 );
        expect( { key: url1 } ).to.not.deep.match( { key: url4 } );
        expect( { key: url4 } ).to.not.deep.match( { key: url1 } );

        expect( url2 ).to.not.deep.match( url3 );
        expect( url3 ).to.not.deep.match( url2 );
        expect( { key: url2 } ).to.not.deep.match( { key: url3 } );
        expect( { key: url3 } ).to.not.deep.match( { key: url2 } );

        expect( url2 ).to.not.deep.match( url4 );
        expect( url4 ).to.not.deep.match( url2 );
        expect( { key: url2 } ).to.not.deep.match( { key: url4 } );
        expect( { key: url4 } ).to.not.deep.match( { key: url2 } );

        expect( url3 ).to.not.deep.match( url4 );
        expect( url4 ).to.not.deep.match( url3 );
        expect( { key: url3 } ).to.not.deep.match( { key: url4 } );
        expect( { key: url4 } ).to.not.deep.match( { key: url3 } );
      });

    });

  });

});

