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
        case 404:
            this.statusMessage = "Not Found";
            break;
        case 500:
            this.statusMessage = "Internal Error";
            break;
        case 201:
            this.statusMessage = "Error 201";
            break;
        default:
            this.statusMessage = "Error " + this.statusCode;
    };
    this.status(sts).send(this.statusMessage);
};

Response.send = function send(str){
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
