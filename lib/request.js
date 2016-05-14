const http = require('http');
const url = require('url');
var Request = {};
Request.body = {};

/*
 * Params of Request Url
 * router url: => /user/:id
 * Request url: => /user/5
 * Request Params => {id: 5}
*/
Request.params = {};

/*
 * Parse the query of Request Url
 * Examples:
 *  url => '/user/?id=4'
 *  req.query() => 'id=4'
*/
Request.query = function(){
    return url.parse(this.url).query || '';
};

module.exports = Request;

