Flicker.js [![Build Status](https://travis-ci.org/flickerstudio/flickerjs.svg?branch=master)](https://travis-ci.org/flickerstudio/flickerjs) [![Dependency Status](https://david-dm.org/flickerstudio/flickerjs.svg)](https://david-dm.org/flickerstudio/flickerjs)
====
A Super fast and simple web framework for node.js (v6.0.0 ES6) based on connect.


Install
====
```
$ npm install flickerjs
```

Usage
====
via [flicker-easy](https://www.npmjs.com/package/flicker-easy) package:
Usage: flickerjs <appname> [dir]. (also 'flicker' command)

```
$ flickerjs todolist
```
Or
```
$ flicker todolist /mydir
```


Basic
===
```javascript
const flicker = require('flickerjs');
var app = flicker();
app.use('/', (req, res) => {
    res.send('Hello Flicker.js');
})
    .listen(3000);

```

Run your app and visit http://localhost:3000/


Simple REST API
====
```javascript

const flicker = require('flickerjs');
const bodyParser = require('body-parser');
const compress = require('compression');

let app = flicker();

app.use(compress())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

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
})
    .get('/todos/:todo', (req,res,next) => { /*  return todo */
        if(req.params.todo >= app.locals.todos.length){
            next();
        }
        else{
            res.json(app.locals.todos[req.params.todo]);
        }
    })
    .post('/todos', (req,res,next) => { /*  insert todo */
        app.locals.todos.push(req.body.todo);
        res.json(app.locals.todos)
    })
    .delete('/todos/:todo', (req,res,next) => { /*  delete todo */
        if(req.params.todo >= app.locals.todos.length){
            next();
        }
        else{
            app.locals.todos.splice(req.params.todo,1);
            res.json(app.locals.todos);
        }
    })
    .put('/todos/:todo', (req,res,next) => { /*  edit todo */
        if(req.params.todo >= app.locals.todos.length){
            next();
        }
        else{
            app.locals.todos[req.params.todo] = req.body.todo;
            res.json(app.locals.todos)
        }
    })

app.use('/api',api) // include the router
    .use('/', (req,res,next) => {
        res.redirect("/api/todos");
    })
    .use((req,res,next) => {
        res.json({}); // return a empty json
    })
    .listen(3000); /* listen */


```


Example
====
```javascript

const flicker = require('flickerjs');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
let app = flicker();
let fooRouter = app.Router();
let barRouter = require('./routers/bar.js'); // external router file

app.set('template','pug')
    .set('static dir','./public')
    .set('views dir','./views')
//app.set('env','production');
    .use(compress())
    .use(favicon('./public/favicon.ico'))
    .use(app.serveStatic('./public'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser());


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
)
    .get('/bar',
        (req,res,next) => {
           res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    );

barRouter.get('/user/:id', (req,res,next) => {
    res.send(req.params.id);
});

fooRouter.use('/bar2',barRouter);
app.use('/foo',fooRouter)
    .use('/bar',barRouter)

    .use('/',(req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js'});
    })

    .use('/test',(req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    })

    .use('/blog',(req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    })

    .use('/user/:id', (req,res,next) => {
        res.send(req.params.id);
    })



    .use(
        (req,res,next) => {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    )

    .use(
        (req,res,next,err) => {
            if(app.get('env') == 'production'){
                err.stack = "";
            }
            res.status(err.status || 500).render("err",{ title: 'Error', error: err});
        }
    )
    .listen(3000);



```


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
app.set('template','pug') /* view engine */
    .set('static dir','./public') /* static content directory (.css, .js, .json...)*/
    .set('views dir','./views'); /* views directory ( .pug, .haml, .html) */
app.locals.foo = 'bar'; /* app.locals is an object that you can use (and call) it everywhere (middlewares, routers, renders...)*/
```
Now, you can add the middlewares you want
```javascript
app.use(compress()) /* data compress*/
.use(favicon('./public/favicon.ico')) /* serve favicon and cache it*/
.use(app.serveStatic('./public')) /* serve static content */
.use(bodyParser.json()) /* data parser to req.body */
.use(bodyParser.urlencoded({ extended: true })) /* same above */
.use(cookieParser()) /* cookies parser to req.cookies */
```
you can set routers for a path (or all) through the use method.
'req': Request,
'res': Response,
'next': Next middleware to call.

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

router.get('/path',(req,res,next) => { /* anything */})
    .post('/path',(req,res,next) => { /* anything */})
    .put('/path',(req,res,next) => { /* anything */})
    .delete('/path',(req,res,next) => { /* anything */})
    .put('/path',(req,res,next) => { /* anything */})
    .use('/user/:id', (req,res,next) => { /* req.params.id */});

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
