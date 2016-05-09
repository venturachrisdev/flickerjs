const flicker = require('../');
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
//app.set('env','production');
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

barRouter.get('/user/:id', (req,res,next) => {
    res.send(req.params.id);
});

fooRouter.use('/bar2',barRouter);
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
    res.send(req.params.id);
});



app.use(
    (req,res,next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
);

app.use(
    if(app.get('env') == 'production'){
        err.stack = "";
    }
    (req,res,next,err) => {
        res.status(err.status || 500).render("err",{ title: 'Error', error: err});
    }
);
app.listen(3000);
