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
app.to({ url: '/'},
    (req, res) => {
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

app.to(compress())
    .to(bodyParser.json())
    .to(bodyParser.urlencoded({ extended: true }));

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

api.to({ url:'/todos', method: 'GET'},
    (req,res,next) => { /* return todos */
        res.json(app.locals.todos);
})
    .to({ url: '/todos/:todo', method: 'GET'},
        (req,res,next) => { /*  return todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                res.json(app.locals.todos[req.params.todo]);
            }
    })
    .to({ url: '/todos', method: 'POST'},
        (req,res,next) => { /*  insert todo */
            app.locals.todos.push(req.body.todo);
            res.json(app.locals.todos)
    })
    .to({ url:'/todos/:todo', method: 'DELETE'},
            (req,res,next) => { /*  delete todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                app.locals.todos.splice(req.params.todo,1);
                res.json(app.locals.todos);
            }
    })
    .to({ url: '/todos/:todo', method: 'PUT'},
            (req,res,next) => { /*  edit todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                app.locals.todos[req.params.todo] = req.body.todo;
                res.json(app.locals.todos)
            }
    })

app.to({ url: '/api'},api) // include the router

    .to({ url: '/'}, (req,res,next) => {
        res.redirect("/api/todos");
    })
    .to((req,res,next) => {
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
//  .to('env','production');
    .to(compress())
//  .to(favicon('./public/favicon.ico'))
    .to(app.serveStatic('./public'))
    .to(bodyParser.json())
    .to(bodyParser.urlencoded({ extended: true }))
    .to(cookieParser());


// inherited in renders
app.locals.year = 2016;

app.to(
    (req,res,next) => {
        // inherited in renders
        res.locals.author = "Flicker.js";
        next();
    }
);


fooRouter.to({ url: '/', method: 'GET'},
    (req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    }
)
    .to({ url: '/bar', method: 'GET'},
        (req,res,next) => {
           res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    );

barRouter.to({ url: '/user/:id', method: 'GET' },
    (req,res,next) => {
        res.send(req.params.id);
});

fooRouter.to({ url: '/bar2'},barRouter);
app.to({ url: '/foo'},fooRouter)
    .to({ url: '/bar'},barRouter)

    .to({ url: '/' },
        (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js'});
    })

    .to({ url: '/test' },
        (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    })

    .to({ url: '/blog' },
        (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    })

    .to({ url: '/user/:id' },
        (req,res,next) => {
            res.send(req.params.id);
    })



    .to(
        (req,res,next) => {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    )

    .to(
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
app.to(compress()) /* data compress*/
    .to(favicon('./public/favicon.ico')) /* serve favicon and cache it*/
    .to(app.serveStatic('./public')) /* serve static content */
    .to(bodyParser.json()) /* data parser to req.body */
    .to(bodyParser.urlencoded({ extended: true })) /* same above */
    .to(cookieParser()) /* cookies parser to req.cookies */
```
you can set routers for a path (or all)  and a method through the 'app.to' method.

'req': Request,

'res': Response,

'next': Next middleware to call.

```javascript
app.to(
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

router.to({ url: '/path', method: 'GET' },(req,res,next) => { /* anything */})
    .to({ url: '/path', method: 'POST' },(req,res,next) => { /* anything */})
    .to({ url: '/path', method: 'PUT' },(req,res,next) => { /* anything */})
    .to({ url: '/path', method: 'DELETE'},(req,res,next) => { /* anything */})
    .to({ url: '/path', method: 'PUT'},(req,res,next) => { /* anything */})
    .to({ url: '/user/:id'}, (req,res,next) => { /* req.params.id */});

/* incorpore to your app */
app.to({ url: '/foo'},router);
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
