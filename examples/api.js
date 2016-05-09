const flicker = require('../');
const bodyParser = require('body-parser');
const compress = require('compression');

let app = flicker();

app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let api = app.Router();

app.locals.todos = [
    {
        description: "Lorem 0"
    },
    {
        description: "Lorem 1"
    },
    {
        description: "Lorem 2"
    },
    {
        description: "Lorem 3"
    },
    {
        description: "Lorem 4"
    },
    {
        description: "Lorem 5"
    }
];

api.get('/todos', (req,res,next) => { /* return todos */
    res.json(app.locals.todos);
});
api.get('/todos/:todo', (req,res,next) => { /*  return todo */
    if(req.params.todo >= app.locals.todos.length){
        next();
    }
    else{
        res.json(app.locals.todos[req.params.todo]);
    }
});
api.post('/todos', (req,res,next) => { /*  insert todo */
    app.locals.todos.push(req.body.todo);
    res.json(app.locals.todos)
});

api.delete('/todos/:todo', (req,res,next) => { /*  delete todo */
    if(req.params.todo >= app.locals.todos.length){
        next();
    }
    else{
        app.locals.todos.splice(req.params.todo,1);
        res.json(app.locals.todos);
    }
});

api.put('/todos/:todo', (req,res,next) => { /*  edit todo */
    if(req.params.todo >= app.locals.todos.length){
        next();
    }
    else{
        app.locals.todos[req.params.todo] = req.body.todo;
        res.json(app.locals.todos)
    }
});

app.use('/api',api); // include the router

app.use('/', (req,res,next) => {
    res.redirect("/api/todos");
});

app.use((req,res,next) => {
    res.json({}); // if error, return a empty json
});

app.listen(3000); /* listen */
