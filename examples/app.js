const flicker = require('../');
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
//  .set('env','production');
    .use(compress())
//  .use(favicon('./public/favicon.ico'))
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
