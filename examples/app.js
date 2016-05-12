const flicker = require('../');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const logger = require('morgan');
let app = flicker();
let fooRouter = app.Router();
let barRouter = require('./routers/bar.js'); // external router file

app.set('template','pug')
    .set('static dir','./public')
    .set('views dir','./views')
//  .add('env','production');
    .add(compress())
    .add(logger('dev'))
//  .add(favicon('./public/favicon.ico'))
    .add(app.serveStatic('./public'))
    .add(bodyParser.json())
    .add(bodyParser.urlencoded({ extended: true }))
    .add(cookieParser());


// inherited in renders
app.locals.year = 2016;

app
    .add(
        (req,res,next) => {
            // inherited in renders
            res.locals.author = "Flicker.js";
            next();
        }
    );


fooRouter
    .add({
        url: '/',
        method: 'GET',
        handler: (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    })
    .add({
        url: '/bar',
        method: 'GET',
        handler: (req,res,next) => {
           res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    })

barRouter
    .add({
        url: '/user/:id',
        method: 'GET',
        handler: (req,res,next) => {
            res.send(req.params.id);
        }
    })

fooRouter
    .add({
        url: '/bar2',
        handler: barRouter
    })
app
    .add({
        url: '/foo',
        handler: fooRouter
    })
    .add({
        url: '/bar',
        handler: barRouter
    })
    .add({
        url: '/',
        handler: (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js'});
        }
    })
    .add({
        url: '/test',
        handler: (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    })

    .add({
        url: '/blog',
        handler: (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    })
    .add({
        url: '/user/:id',
        handler: (req,res,next) => {
            res.send(req.params.id);
        }
    })



    .add({
        handler:[
            (req,res,next) => {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
            },
            (req,res,next,err) => {
                if(app.get('env') == 'production'){
                    err.stack = "";
                }
                res.status(err.status || 500).render("err",{ title: err.message, error: err});
            }
        ]
    })
    .listen(3000, () => {
        console.log('Running...');
    });
