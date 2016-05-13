v2.0.1
====
* Robust nested routers

```javascript
let app = flicker()
let router1 = app.Router();
let router2 = app.Router();
let router3 = app.Router();

router3
    .add({
        url: '/bar',
        handler: (req,res,next) => {
            res.send('Hello!');
        }
    });
router2
    .add({
        url: '/foo',
        handler: router3
    });
router1
    .add({
        url: '/bar',
        handler: router2
    });
app
    .add({
        url: '/foo',
        handler: router1
    })
    .listen(3000);
```
http://localhost:3000/foo/bar/foo/bar show 'Hello!'.

v2.0.0
====
* app.add also receives an array of handlers:

```javascript
app.
    add({
        url: '/home',
        method: 'GET',
        handler: [
            (req,res,next) => {
                res.locals.name = "foo";
                next();
            },
            (req,res,next) => {
                res.send(res.locals.name);
            }
        ]
    })
```

* Rename app.to to app.add:

replacing:
```javascript
    app.to({
        url: '/',
        method: 'GET'
    }, (req,res,next) => {
            res.send('Go!!');
    });
````
with this:
```javascript
    app
        .add({
            url: '/',
            method: 'GET',
            handler: (req,res,next) => {
                res.send('Go!!');
            }
        })
````

v1.1.0
====
* Set morgan as default logger
* Add Response .header
* Add Response .set
* Add Response .get

v1.0.1
====
* Fixed bug when router path was '/'

v1.0.0
====
* Rename app.use to app.to
* Update res.json

v0.1.7
====
* Add promises in app.use
* Add flicker-easy generator

v0.1.4
====
* Add Error handler

v0.1.3
====
* Add res.params in  path ('/user/:id')

v0.1.1
====
* Default middleare when app stack was empty
