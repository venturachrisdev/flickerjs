const flicker = require('../');
let app = flicker();

app.use(app.serveStatic('./public'));


// inherited in renders
app.locals.year = 2016;

app.use('/',(req,res,next) => {
    res.locals.author = "Flicker.js";
    res.render('index',{title: 'Welcome to Flicker.js'});
});

app.listen(3000);
