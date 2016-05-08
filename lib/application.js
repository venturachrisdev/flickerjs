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
    App.console_log = true;

    App.set = (key,val) => {
        App.settings[key] = val || undefined;
    };
    App.get = (key) => {
        return App.settings[key] || undefined;
    };
    App.defaultSettings = () => {
        App.set('template','pug');
        App.set('static dir','./public');
        App.set('views dir','./views');
    };
    App.noLog = () => {
        App.console_log = false;
    };
    App.handle = (request,response) => {
        var req = Object.assign(request,CoolRequest);
        var res = Object.assign(response,CoolResponse);
        req.res = res;
        res.req = req;
        res.app = req.app = App;
        req.originalUrl = url.parse(req.url).pathname;
        req.path = req.originalUrl;
        req.sanitize();
        let idx = 0;
        next();

        function next(){
            if(idx > 1) req.unparsePath();
            if (idx >= App.stack.length) {
                res.end();
                return;
            }
            let layer = App.stack[idx++] || undefined;
            if(layer){
                req.parsePath(layer);
                if(layer.path == '*' && !App.requested){
                    req.originalUrl = req.getPath(req.url2);
                    return layer.handler(req,res,next);
                }
                if(layer.path == req.originalPath){
                    if(layer.router){
                        req.originalUrl = req.originalUrl.substr(layer.path.length,req.originalUrl.length);
                        req.parsePath(layer);
                        return layer.handler(req,res,next);
                    }
                    else{
                        if(layer.method == req.method || layer.method === '*'){
                            req.originalUrl = req.getPath(req.url2);
                            if(req.originalUrl == layer.path){
                                return layer.handler(req,res,next);
                            }
                        }
                    }
                }
            }
            else{
                res.status(404).end(`CANNOT ${req.method} ${req.url}`);
            }
        };
        App.log(req,res);
    };
    App.Router = () => {
        return new aCoolRouter();
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
                return '.html';
            case 'mustache':
                return '.mustache';
            default:
                return '.html';
        }
    }
    App.use = (path,fn) => {
        let hasRouter = false;
        let method = '*';
        if(typeof path === 'function'){
            fn = path;
            path = '*';
        }
        if(fn.use){
            hasRouter = true;
        }
        App.stack.push({path: path, handler: fn, router: hasRouter, method: method});
    };
    App.listen = (port) => {
        var server = http.createServer();
        server.timeout = 0;
        server.on('request',App);
        server.listen(port || 3000);
        if(App.console_log){
            console.log(`${colors.green('[*] Server Listening on port ')} ${colors.blue(port)}\n`);
        };
        return server;
    };

    App.serveStatic = (dir) => {
        return (req,res,next) => {
            let realpath = dir + req.path;
            if(req.path.indexOf('.') != -1 && fs.existsSync(realpath)){
                let filecontent = fs.readFileSync(realpath);
                res.end(filecontent);
            }
            else{
                return next();
            }
        };
    };

    App.log = (req,res) => {
        if(App.console_log){
            let stscolor = "cyan";
            switch(res.statusCode){
                case 200:
                    stscolor = "yellow";
                    break;
                case 500:
                    stscolor = "gray";
                    break;
                case 404:
                    stscolor = "red";
                    break;
            };
            console.log(`${colors[stscolor](res.statusCode)} ${colors.yellow(req.method)} ${req.url}`);
        }
    };
    //initial middleware
    App.use((req,res,next) => {
            next();
        });
    // default settings
    App.defaultSettings();
    return App;
};

module.exports = flickerApp;
