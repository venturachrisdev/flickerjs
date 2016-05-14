const flicker = require('../../');
var router = flicker().Router();
var blogRouter = require('./blog');

router
    .add({
        url: '/',
        method: 'GET',
        handler: (req,res,next) => {
           res.render('index',{title: 'Welcome to Flicker.js', message: 'FlickerJS is Running'});
            }
    })
    .add({
        url: '/blog',
        method: 'GET',
        handler: blogRouter
    })
    .add({
        url: '/login',
        method: 'POST',
        handler: (req,res,next) => {
            var alert = {
                msg: 'Incorrect Username or Password',
                type: 'error'
            }
            res.render('index',{title: 'Sign In'});
        }
    })

module.exports = router;
