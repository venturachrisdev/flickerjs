[![logo](/assets/flickerjs.png)](https://www.npmjs.com/package/flickerjs)
A Super fast and simple web framework for [node.js](http://nodejs.org/).

[![Build Status](https://travis-ci.org/FlickerStudio/flickerjs.svg?branch=master)](https://travis-ci.org/FlickerStudio/flickerjs) [![Dependency Status](https://david-dm.org/flickerstudio/flickerjs.svg)](https://david-dm.org/flickerstudio/flickerjs) [![Build status](https://ci.appveyor.com/api/projects/status/qgxx72iq7wiluutm?svg=true)](https://ci.appveyor.com/project/flickerapps/flickerjs)
```javascript
const flicker = require('flickerjs');
var app = flicker();
app
    .add({
    url: '/',
    handler: (req, res) => {
        res.send('Hello Flicker.js');
        }
    })
    .listen(3000);

```
Install
====
```
$ npm install flickerjs
```

Usage
====
via [flicker-easy](https://www.npmjs.com/package/flicker-easy) package.
Generating the app:
```
$ flickerjs todolist
```
Or
```
$ flicker todolist /mydir
$ cd mydir
```
Install dependencies:
```
$ npm install
```
Starting your server
```
$ npm start
```

Examples
====
To view examples clone the repo and run the example you want.
List of example files:

* api.js
* app.js
* basic.js
* router.js
* next.js

```
$ git clone https://github.com/flickerstudio/flickerjs.git
$ cd flickerjs
$ npm install
$ node /examples/[file]

```

Tests
====
To run tests, after you clone the repo:
```
$ npm install
$ npm test
```

Mini Doc
====
[Flicker Quick Guide](GUIDE.md)



Contributors
====
Thanks to:
* [Christopher Ventura](http://github.com/chrisvent)
* [Dawson Botsford](http://github.com/dawsonbotsford)

License
====
[MIT](LICENSE)
