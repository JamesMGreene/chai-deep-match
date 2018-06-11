# chai-deep-match
[![GitHub Latest Release](https://badge.fury.io/gh/JamesMGreene%2Fchai-deep-match.svg)](https://github.com/JamesMGreene/chai-deep-match) [![Build Status](https://secure.travis-ci.org/JamesMGreene/chai-deep-match.svg?branch=master)](https://travis-ci.org/JamesMGreene/chai-deep-match) [![Coverage Status](https://coveralls.io/repos/JamesMGreene/chai-deep-match/badge.svg?branch=master&service=github)](https://coveralls.io/github/JamesMGreene/chai-deep-match?branch=master) [![Dependency Status](https://david-dm.org/JamesMGreene/chai-deep-match.svg?theme=shields.io)](https://david-dm.org/JamesMGreene/chai-deep-match) [![Dev Dependency Status](https://david-dm.org/JamesMGreene/chai-deep-match/dev-status.svg?theme=shields.io)](https://david-dm.org/JamesMGreene/chai-deep-match#info=devDependencies)

Extends [Chai](http://chaijs.com/) with an assertion for deeply matching objects (i.e. subset equality checking).


## Install

```shell
$ npm install --save chai
$ npm install --save chai-deep-match
```



## Usage

```js
var chai = require('chai');
var chaiDeepMatch = require('chai-deep-match');

chai.use( chaiDeepMatch );


chai.expect( { a: 'foo', b: 'bar', c: 'baz' } ).to.deep.match( { a: 'foo', c: 'baz' } );
// =>  pass

chai.expect( { a: 'foo', b: 'bar', c: 'baz' } ).to.not.deep.match( { a: 'fuzz', c: 'baz' } );
// =>  pass
```


### Note about `URL` objects

This module also supports [WHATWG `URL` objects](https://nodejs.org/docs/latest/api/url.html#url_the_whatwg_url_api), as introduced in Node `7.x` (and backported into Node `6.x`, it seems). However, it is important to note that the behavior by which it compares two `URL` objects will only consider them deeply matched if they are a full 100% match rather than a "subset" match. Hopefully this behavior is acceptable to those making use of it! :pray:


## License

Copyright (c) 2016-2018, James M. Greene (MIT License)
