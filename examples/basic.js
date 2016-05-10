const flicker = require('../');
let app = flicker();

app.to(app.serveStatic('./public'));
// inherited in renders
app.locals.year = 2016;

app.to({ url: '/' },
    (req,res,next) => {
        res.locals.author = "Flicker.js";
        res.repnder('index',{title: 'Welcome to Flicker.js'});
    }
)

    .to({ url: '/user/:id' },
        (req,res,next) => {
            res.send(req.params.id);
    })

    .to({ url: '/blog/:blog/cat/:cat' },
        (req,res,next) => {
            res.json(req.params);
    })
    .listen(3000);
