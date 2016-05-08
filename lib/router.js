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
                        req.origin = req.resource;
                        req.resource = '/';
                        console.log(req.resource);
                        if(req.origin === layer.path){
                            return layer.handler(req,res,internext);
                        }
                        else{
                            return internext();
                        }
                    }
                    else{
                        if(layer.regex){
                            if(layer.regex.exp.test(req.resource)){
                                let values = [];
                                let re = /\/(\w+)/g;
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
                                return layer.handler(req,res,next);
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
                                        return layer.handler(req,res,internext);
                                    }
                                    else{
                                        return internext();
                                    }
                                }
                                else{
                                    requested = true;
                                    return layer.handler(req,res,internext);
                                }
                            }
                            else if(!requested && layer.path == "*"){
                                return layer.handler(req,res,internext);

                            }
                            else{
                                return internext();
                            }
                        }
                    }
                }
            }
            else{
                return next();
            }
        }
    };

  routerProto.stack = [];

  routerProto.use = function(path,fn){
    let regex = false;
    let hasRouter = false;
    let method = '*';
    if(typeof path === 'function'){
        fn = path;
        path = '*';
    }
    if(path.indexOf(':') != -1){ /* is like /user/:id */
            regex = {};
            regex.keys = [];
            regex.exp = routerProto.normalize(path,regex.keys);
            let comp = [];
            let re = /\/(\w+)/g;
            let myArray = path.match(re);
            myArray.forEach( (val) => {
                let foo = val.slice(1);
                comp.push(foo);
            });
            regex.comp = comp;
    }
    else if(fn.use){
        hasRouter = true;
    }
    this.stack.push({path: path, handler: fn, router: hasRouter, method: method, regex: regex});
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
    }
  // create http method verbs
  var methods = ['GET','PUT','POST','DELETE','PATCH' ]
  methods.forEach(function(method){
    routerProto[method.toLowerCase()] = function(path,fn){
        let regex = false;
        if(typeof path == 'function'){
            fn = path;
            path = '*';
        }
        if(path.indexOf(':') != -1){ /* is like /user/:id */
            regex = {};
            regex.keys = [];
            regex.exp = routerProto.normalize(path,regex.keys);
            let comp = [];
            let re = /\/(\w+)/g;
            let myArray = path.match(re);
            myArray.forEach( (val) => {
                let foo = val.slice(1);
                comp.push(foo);
            });
            regex.comp = comp;
        }
      this.stack.push({path: path, handler: fn, method: method, regex: regex});
      return this;
    }
  });

  return routerProto;
}
module.exports = Router;
