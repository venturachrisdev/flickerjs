const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const colors = require('colors');
const CoolRequest = require('./request');
const CoolResponse = require('./response');
const aCoolRouter = require('./router');


function flickerApp(){

    var App = (request,response) => {
        App.handle(request,response);
    }
    App.locals = {};
    App.stack = [];
    App.settings = {};

    App.set = (key,val) => {
        App.settings[key] = val || undefined;
        return App;
    };
    App.get = (key) => {
        return App.settings[key] || undefined;
        return App;
    };
    App.defaultSettings = () => {
        App.set('template','pug');
        App.set('static dir','./public');
        App.set('views dir','./views');
        App.set('env','development');
        return App;
    };
    App.handle = (request,response) => {
        var req = Object.assign(request,CoolRequest);
        var res = Object.assign(response,CoolResponse);
        req.res = res;
        res.req = req;
        res.app = req.app = App;
        req.on('error', (err) => {
                console.log('Problem with request ${err.message}');
        });
        req.path = url.parse(req.url).pathname;
        if(req.url.length > 2){
            if(req.url[req.url.length -1] === '/'){ req.url = req.url.slice(0,-1);}
            if(req.path[req.path.length -1] === '/'){ req.path = req.path.slice(0,-1);}
        }
        req.originalUrl = req.url;
        var idx = 0;
        var requested = false;
        next();
        function next(err){
            if(!err){
                var layer = App.stack[idx++] || undefined;
                if(!layer){
                    res.status(404).send(`CANNOT ${req.method} ${req.path}`);
                    return;
                }
                else{
                    if(layer.router){
                        if(layer.path === '*'){
                            req.origin = '/';
                            req.resource = req.path;
                            try{
                                return layer.handler(req,res,next);
                            }
                            catch(err){
                                next(err);
                            }
                        }
                        else{
                            req.origin = req.path.substr(0,layer.path.length) || '/';
                            if(req.origin == '/'){
                                req.resource = req.path;
                            }
                            else{
                                req.resource = req.path.substr(layer.path.length,req.path.length) || '/';
                            }
                            if(req.origin === layer.path){
                                try{
                                    return layer.handler(req,res,next);
                                }
                                catch(err){
                                    next(err);
                                }
                            }
                            else{
                                return next();
                            }
                        }
                    }
                    else{
                        if(layer.regex){
                            if(layer.regex.exp.test(req.path)){
                                let values = [];
                                let re = /\/(\w+)/g;
                                let myArray = req.path.match(re);
                                myArray.forEach( (val) => {
                                    let foo = val.slice(1);
                                    foo = parseInt(foo) || foo;
                                    values.push(foo);
                                });
                                for(let i = 0; i < values.length; i++){
                                    if(layer.regex.comp.indexOf(values[i]) !== -1){
                                        values.splice(i,1);
                                    }
                                }
                                layer.regex.values = values;
                                for(let i = 0; i< layer.regex.keys.length ; i++){
                                    let key = layer.regex.keys[i];
                                    let val = layer.regex.values[i];
                                    req.params[key] = val;
                                }
                                try{
                                    return layer.handler(req,res,next);
                                }
                                catch(err){
                                    next(err);
                                }
                            }
                            else{
                                return next();
                            }
                        }
                        else{
                            if(layer.path === req.path && layer.path !== '*'){
                                if(layer.method != '*'){
                                    if(layer.method == req.method){
                                        requested = true;
                                        try{
                                            return layer.handler(req,res,next);
                                        }
                                        catch(err){
                                            next(err);
                                        }
                                    }
                                    else{
                                        return next();
                                    }
                                }
                                else{
                                    requested = true;
                                    try{
                                        return layer.handler(req,res,next);
                                    }
                                    catch(err){
                                        next(err);
                                    }
                                }
                            }
                            else if(!requested && layer.path == "*"){
                                try{
                                    return layer.handler(req,res,next);
                                }
                                catch(err){
                                    next(err);
                                }
                            }
                            else{
                                return next();
                            }
                        }
                    }
                }
            }
            else{
                return App.err(req,res,next,err);
            }
        }
    };
    App.Router = () => {
        return new aCoolRouter();
    };
    App.err = function (req,res,next,err){
        if(typeof err === 'string'){
            err = new Error(err);
        }
        let fn = App.stack[App.stack.length -1].handler;
        if(fn.length == 4){
            return fn(req,res,next,err);
        }
        else{
            res.send(err.stack);
        }
        var errstr = err.toString();
        fs.readFile('./flicker.log', (err,file) => {
            var date = new Date();
            let content = file + '\n' + new Date() + ' ---> ' + errstr;
            fs.writeFile('./flicker.log', content,
                (err) => {
                    if (err) throw err;
            });
        });
    };
    App.getViewExt = () => {
        switch(App.get('template')){
            case 'pug':
                return '.pug';
            case 'html':
            case 'swig':
            case 'whiskers':
                return '.html';
            case 'jade':
                return '.jade';
            case 'ejs':
                return '.ejs';
            case 'blade':
                return '.blade';
            case 'haml':
            case 'haml-coffee':
                return '.haml';
            case 'pug':
                return '.pug';
            case 'marko':
                return '.marko';
            case 'handlebars':
            case '.hbs':
                return '.hbs';
            case 'mustache':
                return '.mustache';
            case 'hjs':
                return '.hjs';
            default:
                return '.html';
        }
    }
    App.to = (config,fn) => {
        let regex = false;
        let hasRouter = false;
        let method = '*';
        let path = '*';
        if(typeof config === 'function'){
            fn = config;
        }
        if(config){
           if(config.method){
            method = config.method.toUpperCase();
           }
           if(config.url){
            path = config.url;
           }
        }
        if(path.indexOf(':') != -1){ /* is like /user/:id */
            regex = {};
            regex.keys = [];
            regex.exp = App.normalize(path,regex.keys);
            let comp = [];
            let re = /\/(\w+)/g;
            let myArray = path.match(re);
            myArray.forEach( (val) => {
                let foo = val.slice(1);
                comp.push(foo);
            });
            regex.comp = comp;
        }
        else if(fn.to){ // is a router
            hasRouter = true;
        }
        App.stack.push({path: path, handler: fn, router: hasRouter, method: method,regex: regex});
        return App;
    };
    App.normalize = function(path,keys) {
        if (path instanceof RegExp) return path
        return new RegExp('^' + App.escapeRegexp(App.normalizePath(path), '.')
          .replace(/\*/g, '(.+)')
          .replace(/(\/|\\\.):(\w+)\?/g, function(_, c, key){
            keys.push(key)
            return '(?:' + c + '([^\/]+))?'
          })
          .replace(/:(\w+)/g, function(_, key){
            keys.push(key)
            return '([^\/]+)'
          }) + '$', 'i')
      };
    App.escapeRegexp = function(string, chars) {
      var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
      return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
    }

    App.normalizePath = function(path) {
      return path.replace(/[\s\/]*$/g, '')
    }
    App.listen = (port,callback) => {
        var server = http.createServer();
        server.timeout = 0;
        server.on('request',App);
        server.on('clientError', (err, socket) => {
            socket.end("HTTP/1.1 404 Bad request \r\n\r\n");
        });
        server.listen(port || 3000);
        if(!callback){
            console.log(`${colors.green('[*] Server Listening on port ')} ${colors.blue(port)}\n`);
        };
        callback && callback();
        return server;
    };

    App.serveStatic = (dir) => {
        return (req,res,next) => {
            if(req.path.indexOf('.') != -1){
                var realpath = dir + req.path;
                fs.exists(realpath, (exists) => {
                    if(exists){
                        var tunnel = fs.createReadStream(realpath);
                        tunnel.pipe(res);
                    }
                    else{
                        next();
                    }
                });
            }
            else{
                next();
            }
        };
    };
    //initial middleware
    App.to((req,res,next) => {
            next();
        })
    // default settings
    .defaultSettings();
    return App;
};

module.exports = flickerApp;
