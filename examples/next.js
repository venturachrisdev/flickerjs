const flicker = require('../');
let app = flicker();

app.add(
    (req,res,next) => {
        console.log('Atention: ');
        next();
    }
)
    .add(
        (req,res,next) => {
            console.log('You should see this');
            res.end();
        }
    )

    .add(
        (req,res,next) => {
            console.log('but, You do not should see this');
            res.end();
        }
    )
    .listen(3000);
