const flicker = require('../../');

var router = flicker().Router();

router.to({ url: '/foo', method: 'GET'},
    (req,res,next) => {
       res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    }
)
    .to({url: '/', method: 'GET'},
        (req,res,next) => {
           res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
        }
    );

module.exports = router;
