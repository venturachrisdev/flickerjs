'use strict'
function Router(){

    var routerProto = function(req,res,next){
        if(routerProto.stack.length == 0){
            res.status(404).send(`No routers found`);
        }
        var idxz = 0;
        var requested = false;
        internext();
        function internext(err){
            if(!err){
                let layer = routerProto.stack[idxz++] || undefined;
                if(!layer){
                    return next();
                }
                else{
                    if(layer.router){
                        var origin = req.resource.substr(0,layer.path.length) || '/';
                        if(origin === layer.path){
                            try{
                                req.origin = origin;
                                req.resource = req.resource.substr(layer.path.length, req.resource.length) || '/';
                                return layer.handler(req,res,internext);
                            }
                            catch(err){
                                internext(err);
                            }
                        }
                        else{
                            return internext();
                        }
                    }
                    else{
                        if(layer.regex){
                            if(layer.regex.exp.test(req.resource)){
                                let values = [];
                                let re = /\/([A-Za-z0-9_-]+)/g;
                                let myArray = req.resource.match(re);
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
                                    return layer.handler(req,res,internext);
                                }
                                catch(err){
                                    internext(err);
                                }
                            }
                            else{
                                return internext();
                            }
                        }
                        else{
                            if(layer.path === req.resource && layer.path != '*'){
                                if(layer.method != '*'){
                                    if(layer.method == req.method){
                                        requested = true;
                                        try{
                                            return layer.handler(req,res,internext);
                                        }
                                        catch(err){
                                            internext(err);
                                        }
                                    }
                                    else{
                                        return internext();
                                    }
                                }
                                else{
                                    requested = true;
                                    try{
                                        return layer.handler(req,res,internext);
                                    }
                                    catch(err){
                                        internext(err);
                                    }
                                }
                            }
                            else if(!requested && layer.path == "*"){
                                try{
                                    return layer.handler(req,res,internext);
                                }
                                catch(err){
                                    internext(err);
                                }

                            }
                            else{
                                return internext();
                            }
                        }
                    }
                }
            }
            else{
                next(err);
            }
        }
    };

  routerProto.stack = [];
  routerProto.add = (config) => {
        if(Array.isArray(config)){
            for(let i = 0 ; i < config.length ; i++){
                routerProto.add(config[i]);
            }
        }
        else{
            let fn = () => {};
            let regex = false;
            let hasRouter = false;
            let method = '*';
            let path = '*';
            if(typeof config === 'function'){
                fn = config;
            }
            else{
                fn = config.handler;
                if(config.method){
                    method = config.method.toUpperCase();
                }
                if(config.url){
                    path = config.url;
                    if(path.indexOf(':') != -1){ /* is like /user/:id */
                        regex = {};
                        regex.keys = [];
                        regex.exp = routerProto.normalize(path,regex.keys);
                        let comp = [];
                        let re = /\/(\w+)/g;
                        let myArray = path.match(re);
                        if(myArray){
                            myArray.forEach( (val) => {
                                let foo = val.slice(1);
                                comp.push(foo);
                            });
                            regex.comp = comp;
                        }
                        else{
                            regex.comp = [];
                        }
                    }
                }
            }
            if(Array.isArray(fn)){
                for(let i = 0 ; i < fn.length ; i++){
                    var arrhasRouter = false;
                    if(fn[i].add){ // is a router
                        arrhasRouter = true;
                    }
                    routerProto.stack.push({path: path, handler: fn[i], router: arrhasRouter, method: method,regex: regex});
                }
            }
            else{
                if(fn.add){ // is a router
                    hasRouter = true;
                }
                routerProto.stack.push({path: path, handler: fn, router: hasRouter, method: method,regex: regex});
            }
        }
        return routerProto;
    };
  routerProto.normalize = function(path,keys) {
        if (path instanceof RegExp) return path
        return new RegExp('^' + routerProto.escapeRegexp(routerProto.normalizePath(path), '.')
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
    routerProto.escapeRegexp = function(string, chars) {
      var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
      return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
    }

    routerProto.normalizePath = function(path) {
      return path.replace(/[\s\/]*$/g, '')
    };

  return routerProto;
}
module.exports = Router;
