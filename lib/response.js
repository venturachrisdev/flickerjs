'use strict';
const http = require('http');
const fs = require('fs');
const cons = require('consolidate');

var Response = {};


/*
 * Set a Status code
 *
 * @param {Number} code
 * @return ServerResponse
 * Examples:
 * res.status(404).send('Not Found');
 * res.status(200).json({message: 'OK'});
 *
*/
Response.status = function status(sts){
    if(typeof sts != 'number'){
        console.error('res.status() param must be a number, not a ' + typeof sts);
        sts = 302;
    }
    this.statusCode = sts;
    return this;
};

/*
 * Redirect user (in browser) to an url
 *
 * @param {String} location
 * Examples:
 *  res.redirect('/foo');
 *  res.redirect('http://google.com')
*/

Response.redirect = function(href){
    this.status(302);
    this.setHeader('Location',href);
    this.end();
};


/*
 * Set a Status code and Send the appropiate message
 * @param {Number} statusCode
 * Example:
 *  res.sendStatus(404) => Set status 404 and send "Not Found"
 *  res.sendStatus(204) => Set status 202 and send "Accepted"
 *
*/
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

/*
 * Send content
 * @param {Number|String|Object} content
 * Examples:
 *  res.send('Hello World')
 *  res.send(200);
 *  res.send({"foo":"bar"})
*/
Response.send = function send(str){
    if(typeof str == 'object'){
        this.json(str);
    }
    else if(typeof str == 'number'){
        if(str > 200 && str < 500){
            this.sendStatus(str);
        }
        else{
            this.send(str + "");
        }
    }
    else{
        let strlen = str.length;
        this.setHeader('Content-Length',strlen);
        this.preventStatus(200).end(str);
    }
};

/*
 * Set Header of Response (content)
 * @param {String, String|Number} key,value
 *  Example:
 *  res.set("Content-Type","text/css")
 *  res.header("Content-Length":24354)
 *  res.set("Location","/foo")

*/
Response.header = Response.set = function(key,val){
    this.setHeader(key,val);
};


/*
    Get the Response headers
 * @params {String} Key (Header)
 * Example:
 *  res.get("Content-Type") => "text/html"
 *  res.get("Content-Length") => "376556"
*/
Response.get = function(key){
    return this.getHeader(key);
};


/*
 * Send a object in json format
 * @params {Object} JSON Object
 * Example:
 * res.json({foo: 'bar'})
 * =>
    {
        "foo":"bar"
    }
*/
Response.json = function json(obj){
    if(typeof obj != 'object'){
        console.error('res.json() param must be a object, not a ' + typeof obj);
    }
    this.preventStatus(200);
    this.setHeader("Content-Type","application/json");
    this.write(JSON.stringify(obj,null,2));
    this.end();
};

/*
 * Send the content of a file
 *  @param {String} filename
 * Examples:
 * res.sendFile('./style.css')
 * res.sendFile('/myfile.json')
*/
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


/*
 * Render a template parsing with setted view engine
 * @params {String,Object} Filename, options (vars)
 * Examples:
 *  res.render('index',{foo: "bar", title: 'Title Page'})
*/

Response.render = function(filename,options){
    options = Object.create(Object.assign(options,this.locals));
    options = Object.create(Object.assign(options,this.app.locals));
    options = options || {};
    let path = this.app.get('views dir') + '/' + filename + this.app.getViewExt();
    if(filename[0] == '.'){
        path = filename + this.app.getViewExt();
    }
     cons[this.app.get('template')](path,options, (err, html) => {
        if (err){
        this.app.next(err);
        }
        else{
            this.send(html);
        }
    });
};

/*
* Set a statusCode as long as no one (no override the status coede)
* @params {Number} statuscode
* @return ServerResponse
* Examples: (Similar to res.status)
*   res.preventStatus(200).send("Fooo")
*/
Response.preventStatus = function preventStatus(sts){
    if(!this.statusCode){
        this.status(sts);
    }
    return this;
};

/*
* Response locals
* Examples:
*   res.locals.foo = bar;
* res.json(res.locals) => {foo: "bar"}
*/
Response.locals = {};

module.exports = Response;
