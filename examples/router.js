const flicker = require('../');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
//middlewares

let app = flicker();
let homeRouter = require('./routers/home');

app.set('template','pug')
    .set('static dir',__dirname + '/public')
    .set('views dir',__dirname + '/views')
//  .set('env','production');
    .add(compress())
    .add(logger('dev'))
//  .add(favicon(__dirname + '/public/favicon.ico'));
    .add(app.serveStatic())
    .add(bodyParser.json())
    .add(bodyParser.urlencoded({ extended: true }))
    .add(cookieParser())


// inherited in renders
app.locals.year = 2016;
app.locals.site_title = 'MyFlicker.com';
app.locals.site_description = 'Flicker.js demo';

app
    .add(
        (req,res,next) => { // custom middleware
            // inherited in renders
            res.locals.author = "Flicker.js";
            next();
        }
    )
    .add({
        url: '/',
        handler: homeRouter
    })
    .add(
        (req,res,next) => {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    )

    .add(
        (req,res,next,err) => {
            if(app.get('env') == 'production'){
                err.stack = "";
            }
            res.status(err.status || 500).render("err",{ title: err.message, error: err});
        }
    )

    .listen(3000);
