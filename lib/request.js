const http = require('http');
const url = require('url');
var Request = {};

Request.parsePath = function(layer){
    if(!this.url2){
        this.url2 = this.originalUrl;
    }
    this.originalPath2 = this.originalPath;
    this.path2 = this.path;
    this.originalPath = this.path.substr(0,layer.path.length) || '/';
    if(this.originalPath.length == 1){
        this.path = this.path.substr(layer.path.length - 1,this.path.length) || '/';
    }
    else{
        this.path = this.path.substr(layer.path.length,this.path.length) || '/';
    }
};

Request.parseUrl = function(){
    return url.parse(this.url);
};

Request.sanitize = function(){
    if(this.path.length > 2){
            if(this.path[this.path.length -1] === '/') this.path = this.path.slice(0,-1);
        }
        if(this.originalUrl.length > 2){
            if(this.originalUrl[this.originalUrl.length -1] === '/') this.originalUrl = this.originalUrl.slice(0,-1);
        }
        if(this.url2){
            if(this.url2.length > 2){
                if(this.url2[this.url2.length -1] === '/'){
                  this.url2 = this.url2.slice(0,-1);
                }
            }
            this.originalUrl = this.getPath(this.url2);
            this.unparsePath();
        };
        this.originalUrl = this.originalUrl || '/'
};
Request.getPath = function(href){
    return url.parse(href).pathname;
};
Request.unparsePath = function(){
    this.originalPath = this.originalPath2 || '';
    this.path = this.path2 || '';
};

Request.mergeUrl = function(){
    let mergedUrl = "";
    if(this.originalPath == '/'){
        mergedUrl = this.path;
    }
    else{
        mergedUrl = this.originalPath + this.path;
    }
    if(mergedUrl[mergedUrl.length -1] === '/'){
        mergedUrl = mergedUrl.slice(0,-1);
    }
    return mergedUrl;
};
Request.body = {};
module.exports = Request;

