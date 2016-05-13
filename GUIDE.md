After you install the module, require it:
```javascript
const flicker = require('fickerjs');
```
initialize your app:
```javascript
let app = flicker();
```

If you want, change the default configs:
```javascript
app
    .set('template','pug') /* view engine */
    .set('static dir','./public') /* static content directory (.css, .js, .json...)*/
    .set('views dir','./views'); /* views directory ( .pug, .haml, .html) */
app.locals.foo = 'bar'; /* app.locals is an object that you can use (and call) it everywhere (middlewares, routers, renders...)*/
```
Now, you can add the middlewares you want
```javascript
app.add(compress()) /* data compress*/
    .add(favicon('./public/favicon.ico')) /* serve favicon and cache it*/
    .add(app.serveStatic('./public')) /* serve static content */
    .add(bodyParser.json()) /* data parser to req.body */
    .add(bodyParser.urlencoded({ extended: true })) /* same above */
    .add(cookieParser()) /* cookies parser to req.cookies */
```
you can set routers for a path (or all)  and a method through the 'app.add' method.

| Param | Object |
|-----|---------|
| req | Request. |
| res | Response. |
| next | Next middleware to call. |

```javascript
app.add(
    (req,res,next) => {
        res.render("index",{ title: 'My Title Page'});
    }
);
```
##Response
instance of http.ServerResponse.
```javascript
res.send('foo'); /* => send 'foo' */
res.status(404); // response status is 404
res.status(404).send('Not Found'); /* => send error 404 and 'Not Found' */
res.sendStatus(404); /* => same above */
res.json({'foo': 'bar'}) /* => send '{'foo':'bar'}'*/
res.sendFile('/test.json') /* => send the content of file /public/test.json (or your static dir)*/
res.render('index',{foo: 'bar',bar: 'foo'}) /* => send the view index.pug (default, or your views engine)*/
res.redirect('/foo') /* => redirect users to /foo */
res.locals /* => is similar to app.locals but only lives in current request (you can refresh it inn each request through middlewares) */
```

##Router
Its a handler for your paths. You can to nest routers on the app.
```javascript
let router = app.Router();

router
    .add({
        url: '/path',
        method: 'GET',
        handler: (req,res,next) => { /* anything */}
    })
    .add({
        url: '/path',
        method: 'POST',
        handler: (req,res,next) => { /* anything */}
    })
    .add({
        url: '/path',
        method: 'PUT',
        handler: (req,res,next) => { /* anything */}
    })
    .add({
        url: '/path',
        method: 'DELETE',
        handler: (req,res,next) => { /* anything */}
    })
    .add({
        url: '/path',
        method: 'PUT',
        handler: (req,res,next) => { /* anything */}
    })
    .add({
        url: '/user/:id',
        handler: (req,res,next) => { /* req.params.id */}
    })

/* incorpore to your app */
app
    .add({
    url: '/foo',
    handler: router
    })
```
