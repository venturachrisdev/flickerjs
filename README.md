Flicker.js [![Build Status](https://travis-ci.org/flickerstudio/flickerjs.svg?branch=master)](https://travis-ci.org/flickerstudio/flickerjs) [![Dependency Status](https://david-dm.org/flickerstudio/flickerjs.svg)](https://david-dm.org/flickerstudio/flickerjs)
====
A Super fast and simple web framework for node.js (v6.0.0) based on connect.


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


app.use(
    (req,res,next) => {
        res.status(404).render("404",{ title: '404 - Not Found'});
    }
);

app.listen(3000);


```
