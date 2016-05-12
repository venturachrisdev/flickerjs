const flicker = require('../');
let app = flicker();

app.add(app.serveStatic('./public'));
// inherited in renders
app.locals.year = 2016;

app
    .add({
        url: '/',
        method: 'GET',
        handler: (req,res,next) => {
                res.locals.author = "Flicker.js";
                res.render('index',{title: 'Welcome to Flicker.js'});
            }
        /*
        handler: [
            (req,res,next) => {
                next();
            },
            (req,res,next) => {
                res.render('index',{title: 'Welcome to Flicker.js'});
            }
        ]
        */
    })
    .add({
        url: '/user/:id',
        handler: (req,res,next) => {
            res.send(req.params.id);
        }
    })

    .add({
        url: '/blog/:blog/cat/:cat',
        handler: (req,res,next) => {
            res.json(req.params);
        }
    })
    .listen(3000);
