var flicker = require('../');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var app = flicker();

var router = app.Router();

app.use(compress());
app.use(favicon('./public/favicon.ico'));
app.use(app.serveStatic());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use( (req,res,next) => {
        // middleware work in each request
        res.locals = "Mustang";
        next();
    }
);


router.get('/', (req,res) => {
    console.log(`I receive ${res.locals}`);
    res.template('/index.html');
});

router.get('/form', (req,res,next) => {
    res.template('/form.html');
    next();
});

router.post('/form',(req,res,next) => {
    res.json(req.body);
});


app.use(
    (req,res) => {
        // last middleware, if app does not found routers, call the last (this)
        res.status(404).template("/404.html");
    }
);


app.use(
    (req,res, next, err) =>{
        res.status(err.status || 500);
        res.send(err.message);
    }
);

app.listen(3000);
