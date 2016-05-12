const flicker = require('../');
const bodyParser = require('body-parser');
const compress = require('compression');
const logger = require('morgan');
let app = flicker();

app
    .add(compress())
    .add(bodyParser.json())
    .add(bodyParser.urlencoded({ extended: true }))
    .add(logger('dev'));

let api = app.Router();

app.locals.todos = [
    { description: "Lorem 0" },
    { description: "Lorem 1" },
    { description: "Lorem 2" },
    { description: "Lorem 3" },
    { description: "Lorem 4" },
    { description: "Lorem 5" }
];

api
    .add({
        url:'/todos',
        method: 'GET',
        handler: (req,res,next) => { /* return todos */
            res.json(app.locals.todos);
        }
    })
    .add({
        url: '/todos/:todo',
        method: 'GET',
        handler: (req,res,next) => { /*  return todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                res.json(app.locals.todos[req.params.todo]);
            }
        }
    })
    .add({
        url: '/todos',
        method: 'POST',
        handler: (req,res,next) => { /*  insert todo */
            app.locals.todos.push(req.body.todo);
            res.json(app.locals.todos)
        }
    })
    .add({
        url:'/todos/:todo',
        method: 'DELETE',
        handler: (req,res,next) => { /*  delete todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                app.locals.todos.splice(req.params.todo,1);
                res.json(app.locals.todos);
            }
        }
    })
    .add({
        url: '/todos/:todo',
        method: 'PUT',
        handler: (req,res,next) => { /*  edit todo */
            if(req.params.todo >= app.locals.todos.length){
                next();
            }
            else{
                app.locals.todos[req.params.todo] = req.body.todo;
                res.json(app.locals.todos)
            }
        }
    })

app
    .add({
        url: '/api',
        handler: api /* include the router */
    })
    .add({
        url: '/',
        handler: (req,res,next) => {
            res.redirect("/api/todos");
        }
    })
    .add((req,res,next) => {
        res.json({}); // return a empty json
    })
    .listen(3000); /* listen */
