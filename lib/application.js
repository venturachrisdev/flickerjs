var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var colors = require('colors');
var CoolRequest = require('./request');
var CoolResponse = require('./response');

var app = function(){
    self = this;
    this.stack = [];
    this.Layer = {};
    this.use = (path,fn) => {
        if(typeof path === 'function'){
            fn = path;
            path = '*';
        }
        this.stack.push({path: path, router: fn,});
    };
    this.Router = () => {
        this.Router.get = (path,fn) => {
                this.stack.push({path: path, router: fn, method: 'GET'});
        };
        this.Router.post = (path,fn) => {
                this.stack.push({path: path, router: fn, method: 'POST'});
        };
        this.Router.put = (path,fn) => {
                this.stack.push({path: path, router: fn, method: 'PUT'});
        };
        this.Router.delete = (path,fn) => {
                this.stack.push({path: path, router: fn, method: 'DELETE'});
        };
        this.Router.patch = (path,fn) => {
                this.stack.push({path: path, router: fn, method: 'PATCH'});
        };
        return this.Router;
    };
    this.handle = (request,response) => {
        var req = Object.assign(request,CoolRequest);
        var res = Object.assign(response,CoolResponse);
        req.on('error', (err) => {
                console.log('Problem with request ${err.message}');
        });

        req.path = url.parse(req.url).pathname;
        var idx = 0;
        var requested = false;
        next();
        function next(err){
            if(!err){
                var layer = this.stack[idx++];
                if(!layer){
                    res.status(404).send(`CANNOT ${req.method} ${req.path}`);
                    return;
                }
                else{
                    if(layer.path === req.path){
                        if(layer.method){
                            if(layer.method == req.method){
                                requested = true;
                                return layer.router(req,res,next);
                            }
                            else{
                                next();
                            }
                        }
                        else{
                            requested = true;
                            return layer.router(req,res,next);
                        }
                    }
                    else if(!requested && layer.path == "*"){
                        return layer.router(req,res,next);

                    }
                    else{
                        next();
                    }
                }
            }
            else{
                return this.stack[this.stack.length - 1].router(req,res,next,err);
            }
        }
        this.log(req,res);
    };

    this.serveStatic = () => {
        return (req,res,next) => {
            if(req.path.indexOf('.') != -1){
                var realpath = './public' + req.path;
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

    this.log = (req,res) => {
        var stscolor = "blue";
        switch(res.statusCode){
            case 200:
                stscolor = "yellow";
                break;
            case 500:
                stscolor = "pink";
                break;
            case 404:
                stscolor = "red";
                break;
        };
        console.log(`${colors[stscolor](res.statusCode)} ${colors.yellow(req.method)} ${req.path}`);
    }
    this.listen = (port) => {
        var server = http.createServer();
        server.on('request',this.handle);
        server.on('clientError', (err, socket) => {
            socket.end("HTTP/1.1 404 Bad request \r\n\r\n");
        });
        server.listen(port);
        console.log(`${colors.green('[*] Server Listening on port ')} ${colors.blue(port)}\n`);
    };
    return this;
}

module.exports = app;
