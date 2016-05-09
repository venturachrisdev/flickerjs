const flicker = require('../');
let app = flicker();

app.use(app.serveStatic('./public'));
// inherited in renders
app.locals.year = 2016;

app.use('/',(req,res,next) => {
    res.locals.author = "Flicker.js";
    res.render('index',{title: 'Welcome to Flicker.js'});
})

    .use('/user/:id', (req,res,next) => {
        res.send(req.params.id);
    })

    .use('/blog/:blog/cat/:cat', (req,res,next) => {
        res.json(req.params);
    })
    .listen(3000);
