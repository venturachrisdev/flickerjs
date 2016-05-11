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
//  .to('env','production');
    .to(compress())
    .to(logger('dev'))
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
            res.status(err.status || 500).render("err",{ title: err.message, error: err});
        }
    )
    .listen(3000, () => {
        console.log('Running...');
    });
