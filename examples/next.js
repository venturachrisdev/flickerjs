const flicker = require('../');
let app = flicker();

app.to(
    (req,res,next) => {
        console.log('Atention: ');
        next();
    }
)
    .to(
        (req,res,next) => {
            console.log('You should see this');
            res.end();
        }
    )

    .to(
        (req,res,next) => {
            console.log('but, You do not should see this');
            res.end();
        }
    )

    .listen(3000);
