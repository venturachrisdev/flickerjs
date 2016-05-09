const should = require('should');
const assert = require('assert');
const request = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flicker = require('../');

describe('App',
    () => {
        it('should be callable',
            () => {
                let app = flicker();
                assert.equal(typeof app,'function');
            }
        );

        it('get and set',
            (done) => {
                let app = flicker();
                app.noLog(); /* do not console log => "Server running on port ..."
                or "200 GET /url" */
                app.use((req,res,next) => {
                    app.set('foo','bar');
                    next();
                });

                app.use((req,res,next) => {
                    res.send(app.get('foo'));
                });
                request(app)
                .get('/')
                .expect(200,'bar',done);
            }
        );
        it('locals should be inherited',
            (done) => {
                let app = flicker();
                app.noLog();
                app.locals = { blog_title: 'Lorem Ipsum'};
                app.use((req,res,next) => {
                    app.locals.description =  'Lorem Ipsum dolor sit amet';
                    next();
                });

                app.use('/pretty',
                    (req,res,next) => {
                        res.send(app.locals.blog_title);
                    }
                );

                request(app)
                .get('/pretty')
                .expect(200,'Lorem Ipsum',done);
            }
        );
    }
);
describe('Router statusCode',
    () => {
        it('should be 200',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use((req,res,next) => {
                    res.sendStatus(200);
                });
                request(app)
                .get('/')
                .expect(200,done);

        });
        it('should be 404',
            (done) => {
                let app = flicker();
                app.noLog();
                request(app)
                .get('/')
                .expect(404,done);

        });
        it('should be 201',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.status(201).end();
                    }
                );
                request(app)
                .get('/')
                .expect(201,done);
            }
        );
        it('should be 500',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use((req,res) => {
                    res.status(500).end();
                });
                request(app)
                .get('/')
                .expect(500,done);
            }
        );
    }
);

describe('Routing HTTP verbs',
    () => {
        it('middleares responses all verbs',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res,next) => {
                        res.send("Flicker");
                    }
                );
                request(app)
                .patch('/')
                .expect(200,"Flicker",done);

            }
        );

        it('GET',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.get('/app',
                    (req,res,next) => {
                        res.send("Flicker");
                    }
                );
                app.use(router);
                request(app)
                .get('/app')
                .expect(200,"Flicker",done);

            }
        );

        it('POST',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.post('/app',
                    (req,res,next) => {
                        res.send("Flicker");
                    }
                );
                app.use(router);
                request(app)
                .post('/app')
                .expect(200,"Flicker",done);

            }
        );

        it('PUT',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.put('/app',
                    (req,res,next) => {
                        res.send("Flicker");
                    }
                );
                app.use(router);
                request(app)
                .put('/app')
                .expect(200,"Flicker",done);

            }
        );

        it('DELETE',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.delete('/app',
                    (req,res,next) => {
                        res.send("Flicker");
                    }
                );
                app.use(router);
                request(app)
                .delete('/app')
                .expect(200,"Flicker",done);

            }
        );

        it('PATCH',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.patch('/app',
                    (req,res,next) => {
                        res.send("Flicker");
                    }
                );
                app.use(router);
                request(app)
                .patch('/app')
                .expect(200,"Flicker",done);

            }
        );


        it('GET do not reponses for POST method',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.get('/pretty',
                    (req,res,next) => {
                        res.send('I am a GET Response');
                    }
                );
                app.use(router);
                request(app)
                .post('/pretty')
                .expect(404,done);
            }
        );

        it('PUT do not reponses for DELETE method',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.put('/pretty',
                    (req,res,next) => {
                        res.send('I am a GET Response');
                    }
                );
                app.use(router);
                request(app)
                .delete('/pretty')
                .expect(404,done);
            }
        )
    }
);

describe('Response Object',
    () => {
        it('end()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.end("foo");
                    }
                );

                request(app)
                .get('/')
                .expect(200,'foo',done);
            }
        );
        it('send()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.send("bar");
                    }
                );

                request(app)
                .get('/')
                .expect(200,'bar',done);
            }
        );

        it('status()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.status(500).end("bar");
                    }
                );

                request(app)
                .get('/')
                .expect(500,'bar',done);
            }
        );

        it('preventStatus() do not override the current statusCode',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.status(200).preventStatus(404).end();
                    }
                );

                request(app)
                .get('/')
                .expect(200,done);
            }
        );
        it('json()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.json({ foo: 'bar' } );
                    }
                );

                request(app)
                .get('/')
                .expect(200,{ foo: 'bar' },done);
            }
        );

        it('sendFile()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use('/pretty',
                    (req,res,next) => {
                        res.sendFile('examples/public/test.json');
                    }
                );
                request(app)
                .get('/pretty')
                .expect(200,done);
            }
        );

        it('render()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use('/pretty',
                    (req,res,next) => {
                        res.render('./test/views/index',{});
                    }
                );
                request(app)
                .get('/pretty')
                .expect(200,done);
            }
        );
        it('redirect()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use('/pretty',
                    (req,res,next) => {
                        res.redirect('http://google.com/');
                    }
                );
                request(app)
                .get('/pretty')
                .expect(302,done);
            }
        );
        it('locals should be inherited',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use((req,res,next) => {
                    res.locals = { user: 'me' };
                    next();
                });

                app.use('/pretty',(req,res,next) => {
                    res.send(res.locals.user);
                });
                request(app)
                .get('/pretty')
                .expect(200,'me',done);
        });
    }
);

describe('Request Object',
    () => {
        it('body should be inherited',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(bodyParser.json());
                router.post('/pretty',(req,res,next) => {
                    res.send(req.body.name);
                });
                app.use(router);
                request(app)
                .post('/pretty')
                .send({
                    name: 'me'
                })
                .expect(200,'me',done);
        });

        it('cookies should be inherited',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                app.use((req,res,next) => {
                    req.cookies = {'foo':'bar'};
                    next();
                });
                router.get('/pretty',(req,res,next) => {
                    res.send(req.cookies.foo);
                });
                app.use(router);
                request(app)
                .get('/pretty')
                .expect(200,'bar',done);
        });

        it('Url',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                router.get('/pretty',(req,res,next) => {
                    res.send(req.url);
                });
                app.use(router);
                request(app)
                .get('/pretty?=df')
                .expect(200,'/pretty?=df',done);
        });

        it('Path',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                router.get('/pretty',(req,res,next) => {
                    res.send(req.path);
                });
                app.use(router);
                request(app)
                .get('/pretty?=df')
                .expect(200,'/pretty',done);
        });

        it('Method',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                router.put('/pretty',(req,res,next) => {
                    res.send(req.method);
                });
                app.use(router);
                request(app)
                .put('/pretty')
                .expect(200,'PUT',done);
        });

        it('Params',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                router.get('/user/:id', (req,res,next) => {
                    res.send(req.params.id);
                });
                app.use(router);
                request(app)
                .get('/user/5')
                .expect(200,'5',done);
            }
        );

        it('Query',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use((req,res,next) => {
                    res.send(req.query());
                });
                request(app)
                .get('/?foo=bar')
                .expect(200,'foo=bar',done);
            }
        );
    }
);

describe('Serving Static content',
    () => {
        it('OK /favicon.ico',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app)
                .get('/favicon.ico')
                .expect(200,done);
            }
        );

        it('OK /css/style.css',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app)
                .get('/css/style.css')
                .expect(200,done);
            }
        );

        it('OK /js/index.js',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app)
                .get('/js/index.js')
                .expect(200,done);
            }
        );

        it('OK /test.json',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app)
                .get('/test.json')
                .expect(200,done);
            }
        );
    }
);
