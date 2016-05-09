Flicker.js [![Build Status](https://travis-ci.org/flickerstudio/flickerjs.svg?branch=master)](https://travis-ci.org/flickerstudio/flickerjs) [![Dependency Status](https://david-dm.org/flickerstudio/flickerjs.svg)](https://david-dm.org/flickerstudio/flickerjs)
====
A Super fast and simple web framework for node.js (v6.0.0 ES6) based on connect.


Install
====
```
$ npm install flickerjs
```

Quick Use
===
```javascript
const flicker = require('flickerjs');
var app = flicker();

app.use('/', (req, res) => {
    res.send('Hello Flicker.js');
});

app.listen(3000);

```

Run your app and visit http://localhost:3000/

Example
====
```javascript

cconst flicker = require('../');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
let app = flicker();
let fooRouter = app.Router();
let barRouter = require('./routers/bar.js'); // external router file

app.set('template','pug');
app.set('static dir','./public');
app.set('views dir','./views');

app.use(compress());
app.use(favicon('./public/favicon.ico'));
app.use(app.serveStatic('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// inherited in renders
app.locals.year = 2016;

app.use(
    (req,res,next) => {
        // inherited in renders
        res.locals.author = "Flicker.js";
        next();
    }
);
fooRouter.get('/',
    (req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    }
);

fooRouter.get('/bar',
    (req,res,next) => {
       res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    }
);



app.use('/foo',fooRouter);
app.use('/bar',barRouter);

app.use('/',(req,res,next) => {
    res.render('index',{title: 'Welcome to Flicker.js'});
});

app.use('/test',(req,res,next) => {
    res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
});

app.use('/blog',(req,res,next) => {
    res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
});

app.use('/user/:id', (req,res,next) => {
    res.json(req.params.id);
});


app.use(
    (req,res,next) => {
        res.status(404).render("404",{ title: '404 - Not Found'});
    }
);

app.listen(3000);


```


Simple REST API
====
```javascript

const flicker = require('flickerjs');
const bodyParser = require('body-parser');
const compress = require('compression');

let app = flicker();

app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let api = app.Router();

app.locals.todos = [
    {
        description: "Lorem 0"
    },
    {
        description: "Lorem 1"
    },
    {
        description: "Lorem 2"
    },
    {
        description: "Lorem 3"
    },
    {
        description: "Lorem 4"
    },
    {
        description: "Lorem 5"
    }
];

api.get('/todos', (req,res,next) => { /* return todos */
    res.json(app.locals.todos);
});
api.get('/todos/:todo', (req,res,next) => { /*  return todo */
    if(req.params.todo >= app.locals.todos.length){
        next();
    }
    else{
        res.json(app.locals.todos[req.params.todo]);
    }
});
api.post('/todos', (req,res,next) => { /*  insert todo */
    app.locals.todos.push(req.body.todo);
    res.json(app.locals.todos)
});

api.delete('/todos/:todo', (req,res,next) => { /*  delete todo */
    if(req.params.todo >= app.locals.todos.length){
        next();
    }
    else{
        app.locals.todos.splice(req.params.todo,1);
        res.json(app.locals.todos);
    }
});

api.put('/todos/:todo', (req,res,next) => { /*  edit todo */
    if(req.params.todo >= app.locals.todos.length){
        next();
    }
    else{
        app.locals.todos[req.params.todo] = req.body.todo;
        res.json(app.locals.todos)
    }
});

app.use('/api',api); // include the router

app.use('/', (req,res,next) => {
    res.redirect("/api/todos");
});

app.use((req,res,next) => {
    res.json({}); // if error, return a empty json
});

app.listen(3000); /* listen */


```

Examples
====
To view examples clone the repo and run the example you want [app.js, next.js, basic.js]:
```
$ git clone https://github.com/flickerstudio/flickerjs.git
$ cd flickerjs
$ npm install
$ node /examples/app.js

```

Tests
====
To run tests:
```
$ npm install
$ npm test
```


Docs
====

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
app.set('template','pug'); /* view engine */
app.set('static dir','./public'); /* static content directory (.css, .js, .json...)*/
app.set('views dir','./views'); /* views directory ( .pug, .haml, .html) */
app.locals.foo = 'bar'; /* app.locals is an object that you can use (and call) it everywhere (middlewares, routers, renders...)*/
```
Now, you can add the middlewares you want
```javascript
app.use(compress()); /* data compress*/
app.use(favicon('./public/favicon.ico')); /* serve favicon and cache it*/
app.use(app.serveStatic('./public')); /* serve static content */
app.use(bodyParser.json()); /* data parser to req.body */
app.use(bodyParser.urlencoded({ extended: true })); /* same above */
app.use(cookieParser()); /* cookies parser to req.cookies */
```
you can set routers for a path (or all) through the use method.
req: Request.
res: Response.
next: Next middleware to call.

```javascript
app.use(
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

router.get('/path',(req,res,next) => { /* anything */});
router.post('/path',(req,res,next) => { /* anything */});
router.put('/path',(req,res,next) => { /* anything */});
router.delete('/path',(req,res,next) => { /* anything */});
router.put('/path',(req,res,next) => { /* anything */});
router.use('/user/:id', (req,res,next) => { /* req.params.id */});

/* incorpore to your app */
app.use('/foo',router);
```

License
====

Christopher Ventura <chrisventjs@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
