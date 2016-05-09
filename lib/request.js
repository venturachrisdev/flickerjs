const http = require('http');
const url = require('url');
var Request = {};
Request.body = {};
Request.params = {};

Request.query = function(){
    return url.parse(this.url).query || '';
};
module.exports = Request;

