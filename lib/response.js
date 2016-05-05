var http = require('http');
var fs = require('fs');

var Response = {};

Response.status = function status(sts){
    if(typeof sts !== 'number'){
        throw new Error('res.status() param must be a number, not a ' + typeof sts);
    }
    this.statusCode = sts;
    return this;
};

Response.send = function send(str){
    if(typeof str !== 'string'){
        throw new Error('res.send() param must be a string, not a ' + typeof str);
    }
    this.end(str);
};


Response.json = function json(obj){
    if(typeof obj != 'object'){
        throw new Error('res.json() param must be a object, not a ' + typeof obj);
    }
    this.preventStatus(200);
    this.setHeader("Content-Type","application/json");
    this.write(JSON.stringify(obj));
    this.end();
};

Response.template = function template(filename){
    var tunnel = fs.createReadStream("./public" + filename);
    tunnel.pipe(this);
};


Response.preventStatus = function preventStatus(sts){
    if(!this.statusCode){
        this.status(sts);
    }
};

Response.locals = "";

module.exports = Response;
