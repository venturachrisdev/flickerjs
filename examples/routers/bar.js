const flicker = require('../../');

var router = flicker().Router();

router.get('/',
    (req,res,next) => {
        next();
    }
);

/*
router.get('/',
    (req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    }
);
router.get('/foo',
    (req,res,next) => {
        res.render('index',{title: 'Welcome to Flicker.js', message: 'Hello, I`m ' + req.url});
    }
);
*/
router.get(
    (req,res,next) => {
       res.send("Boo");
    }
);

module.exports = router;
