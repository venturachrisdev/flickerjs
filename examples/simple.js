var flicker = require('../');
var app = flicker();

app.use('/', (req, res) => {
    res.send('Hello Flicker.js');
});

app.listen(3000);
