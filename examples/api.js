const flicker = require('../');
const bodyParser = require('body-parser');
const compress = require('compression');
const logger = require('morgan');
let app = flicker();

app.to(compress())
    .to(bodyParser.json())
    .to(bodyParser.urlencoded({ extended: true }))
    .to(logger('dev'));

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

api.to({ url:'/todos', method: 'GET'},
    (req,res,next) => { /* return todos */
        res.json(app.locals.todos);
})
    .to({ url: '/todos/:todo', method: 'GET'},
        (req,res,next) => { /*  return todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                res.json(app.locals.todos[req.params.todo]);
            }
    })
    .to({ url: '/todos', method: 'POST'},
        (req,res,next) => { /*  insert todo */
            app.locals.todos.push(req.body.todo);
            res.json(app.locals.todos)
    })
    .to({ url:'/todos/:todo', method: 'DELETE'},
            (req,res,next) => { /*  delete todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                app.locals.todos.splice(req.params.todo,1);
                res.json(app.locals.todos);
            }
    })
    .to({ url: '/todos/:todo', method: 'PUT'},
            (req,res,next) => { /*  edit todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                app.locals.todos[req.params.todo] = req.body.todo;
                res.json(app.locals.todos)
            }
    })

app.to({ url: '/api'},api) // include the router

    .to({ url: '/'}, (req,res,next) => {
        res.redirect("/api/todos");
    })
    .to((req,res,next) => {
        res.json({}); // return a empty json
    })
    .listen(3000); /* listen */
