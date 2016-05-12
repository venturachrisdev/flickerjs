const flicker = require('../../');

var router = flicker().Router();

router
    .add({
        url: '/foo',
        method: 'GET',
        handler: (req,res,next) => {
            res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    })
    .add({
        url: '/',
        method: 'GET',
        handler: (req,res,next) => {
           res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    })

module.exports = router;
