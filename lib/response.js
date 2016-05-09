const http = require('http');
const fs = require('fs');
const cons = require('consolidate');

var Response = {};

Response.status = function status(sts){
    if(typeof sts != 'number'){
        console.error('res.status() param must be a number, not a ' + typeof sts);
        sts = 302;
    }
    this.statusCode = sts;
    return this;
};

Response.redirect = function(href){
    this.status(302);
    this.setHeader('Location',href);
    this.end();
};
Response.sendStatus = function sendStatus(sts){
    if(typeof sts !== 'number'){
        console.error('res.sendStatus() param must be a number, not a ' + typeof str);
        sts = 302;
    }
    switch(sts){
        case 200:
            this.statusMessage = "OK";
            break;
        case 201:
            this.statusMessage = "Created";
            break;
        case 202:
            this.statusMessage = "Accepted";
            break;
        case 204:
            this.statusMessage = "No Content";
            break;
        case 302:
            this.statusMessage = "Found";
            break;
        case 304:
            this.statusMessage = "Not Modified";
            break;
        case 400:
            this.statusMessage = "Bad Request";
            break;
        case 401:
            this.statusMessage = "Unauthorized";
            break;
        case 403:
            this.statusMessage = "Forbidden";
            break;
        case 406:
            this.statusMessage = "Not Acceptable";
            break;
        case 404:
            this.statusMessage = "Not Found";
            break;
        case 415:
            this.statusMessage = "Unsoported Media Type";
            break;
        case 429:
            this.statusMessage = "Too Many Requests";
            break;
        case 431:
            this.statusMessage = "Request Header Fields Too Large";
            break;
        case 500:
            this.statusMessage = "Internal Error";
            break;
        default:
            this.statusMessage = "Error " + this.statusCode;
    };
    this.status(sts).send(this.statusMessage);
};

Response.send = function send(str){
    if(typeof str !== 'string'){
        str = str + "";
    }
    this.preventStatus(200).end(str);
};


Response.json = function json(obj){
    if(typeof obj != 'object'){
        console.error('res.json() param must be a object, not a ' + typeof obj);
    }
    this.preventStatus(200);
    this.setHeader("Content-Type","application/json");
    this.write(JSON.stringify(obj));
    this.end();
};

Response.sendFile = function sendFile(filename){
    var path;
    path = "./" + filename; // current folder;
    if(filename[0] === '.'){
        path = filename; // is absolute
    }
    else if(filename[0] === '/'){
        path = this.app.get('static dir') + filename; // public folder
    }
    let filecontent = fs.readFileSync(path);
    this.end(filecontent);
};


Response.render = function(filename,options){
    options = Object.create(Object.assign(options,this.locals));
    options = Object.create(Object.assign(options,this.app.locals));
    options = options || {};
    let path = this.app.get('views dir') + '/' + filename + this.app.getViewExt();
    if(filename[0] == '.'){
        path = filename + this.app.getViewExt();
    }
    cons[this.app.get('template')](path,options, (err, html) => {
        if (err) throw err;
        this.send(html);
    });
};
Response.preventStatus = function preventStatus(sts){
    if(!this.statusCode){
        this.status(sts);
    }
    return this;
};

Response.locals = {};

module.exports = Response;
