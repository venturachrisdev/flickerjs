const flicker = require('../');
let app = flicker();

app.use(
    (req,res,next) => {
        console.log('Atention: ');
        next();
    }
)
    .use(
        (req,res,next) => {
            console.log('You should see this');
            res.end();
        }
    )

    .use(
        (req,res,next) => {
            console.log('but, You do not should see this');
            res.end();
        }
    )

    .listen(3000);
