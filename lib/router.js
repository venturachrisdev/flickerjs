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
            else{
                return next();
            }
        }
    };

  routerProto.stack = [];

  routerProto.use = function(path,fn){
    let hasRouter = false;
    let method = '*';
    if(typeof path === 'function'){
        fn = path;
        path = '*';
    }
    if(fn.use){
        hasRouter = true;
    }
    this.stack.push({path: path, handler: fn, router: hasRouter, method: method});
  };

  // create http method verbs
  var methods = ['GET','PUT','POST','DELETE','PATCH' ]
  methods.forEach(function(method){
    routerProto[method.toLowerCase()] = function(path,fn){
        if(typeof path == 'function'){
            fn = path;
            path = '*';
        }
      this.stack.push({path: path, handler: fn, method: method});
      return this;
    }
  });

  return routerProto;
}
module.exports = Router;
