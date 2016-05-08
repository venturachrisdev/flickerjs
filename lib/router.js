function Router(){

  var routerProto = function(req,res,next){
    if(routerProto.stack.length == 0){
        res.status(404).send(`No routers found`);
    }
    req.sanitize();
        let idx = 0;
        internext();

        function internext(){
            let layer = routerProto.stack[idx++] || undefined;
            if(layer){
                if(idx == 0) req.parsePath(layer);
                if(layer.path == '*'){
                    req.originalUrl = req.getPath(req.url2);
                    return layer.handler(req,res,internext);
                }
                if(layer.path == req.path){
                    if(layer.router){
                        req.originalUrl = req.originalUrl.substr(layer.path.length,req.originalUrl.length);
                        req.parsePath(layer);
                        return layer.handler(req,res,internext);
                    }
                    else{
                        if(layer.method == req.method || layer.method === '*'){
                            req.originalUrl = req.getPath(req.url2);
                            return layer.handler(req,res,internext);
                        }
                    }
                }
                internext();
            }
            else{
                req.unparsePath();
                return next();
            }
        };
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
      this.stack.push({path: path, handler: fn, method: method});
      return this;
    }
  });

  return routerProto;
}
module.exports = Router;
