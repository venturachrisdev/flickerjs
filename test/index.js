const should = require('should');
const assert = require('assert');
const request = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flicker = require('../');

describe('App',
    () => {
        it('should not be empty',
            () => {
                let app = flicker();
                assert.equal(typeof app,'object');
            }
        );

        it('listen should be a http.Server instance',
            () => {
                let app = flicker();
                app.noLog();
                let server = app.listen(0);
                assert.equal(server instanceof http.Server,true);
            }
        );

        it('app.locals should be inherited',
            (done) => {
                let app = flicker();
                app.noLog(); /* do not console log => "Server running on port ..."
                or "200 GET /url" */
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

                request(app.listen(0))
                .get('/pretty')
                .expect(200,'Lorem Ipsum',done);
            }
        );
    }
);
describe('Router statusCodes',
    () => {
        it('statusCode should be 200',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use((req,res) => {
                    res.status(200).end();
                });
                request(app.listen(0))
                .get('/')
                .expect(200,done);

        });
        it('statusCode should be 404',
            (done) => {
                let app = flicker();
                app.noLog();
                request(app.listen(0))
                .get('/pretty')
                .expect(404,done);

        });
        it('statusCode should be 201',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.status(201).end();
                    }
                );
                request(app.listen(0))
                .get('/')
                .expect(201,done);
            }
        );
        it('statusCode should be 500',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use((req,res) => {
                    res.status(500).end();
                });
                request(app.listen(0))
                .get('/')
                .expect(500,done);
            }
        );
    }
);

describe('Routing all HTTP verbs',
    () => {
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
                request(app.listen(0))
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
                request(app.listen(0))
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
                request(app.listen(0))
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
                request(app.listen(0))
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
                request(app.listen(0))
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

                request(app.listen(0))
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

                request(app.listen(0))
                .delete('/pretty')
                .expect(404,done);
            }
        )
    }
);

describe('Response Object',
    () => {
        it('Response end()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.end("foo");
                    }
                );

                request(app.listen(0))
                .get('/')
                .expect(200,'foo',done);
            }
        );
        it('Response send()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.send("bar");
                    }
                );

                request(app.listen(0))
                .get('/')
                .expect(200,'bar',done);
            }
        );

        it('Response status()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.status(500).end("bar");
                    }
                );

                request(app.listen(0))
                .get('/')
                .expect(500,'bar',done);
            }
        );

        it('Response preventStatus() do not override the current statusCode',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.status(200).preventStatus(404).end();
                    }
                );

                request(app.listen(0))
                .get('/')
                .expect(200,done);
            }
        );
        it('Response json()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(
                    (req,res) => {
                        res.json({ foo: 'bar' } );
                    }
                );

                request(app.listen(0))
                .get('/')
                .expect(200,{ foo: 'bar' },done);
            }
        );

        it('Reponse template()',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use('/pretty',
                    (req,res,next) => {
                        res.template('examples/public/index.html');
                    }
                );
                request(app.listen(0))
                .get('/pretty')
                .expect(200,done);
            }
        );
        it('Response locals should be inherited',
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
                request(app.listen(0))
                .get('/pretty')
                .expect(200,'me',done);
        });
    }
);

describe('Request Object',
    () => {
        it('Request body should be inherited',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(bodyParser.json());
                router.post('/pretty',(req,res,next) => {
                    res.send(req.body.name);
                });
                request(app.listen(0))
                .post('/pretty')
                .send({
                    name: 'me'
                })
                .expect(200,'me',done);
        });

        it('Request cookies should be inherited',
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
                request(app.listen(0))
                .get('/pretty')
                .expect(200,'bar',done);
        });

        it('Request Url',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                router.get('/pretty',(req,res,next) => {
                    res.send(req.url);
                });
                request(app.listen(0))
                .get('/pretty?=df')
                .expect(200,'/pretty?=df',done);
        });

        it('Request Path',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                router.get('/pretty',(req,res,next) => {
                    res.send(req.path);
                });
                request(app.listen(0))
                .get('/pretty?=df')
                .expect(200,'/pretty',done);
        });

        it('Request Method',
            (done) => {
                let app = flicker();
                app.noLog();
                let router = app.Router();
                app.use(cookieParser());
                router.put('/pretty',(req,res,next) => {
                    res.send(req.method);
                });
                request(app.listen(0))
                .put('/pretty')
                .expect(200,'PUT',done);
        });
    }
);

describe('Serving Static content',
    () => {
        it('OK /favicon.ico',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app.listen(0))
                .get('/favicon.ico')
                .expect(200,done);
            }
        );

        it('OK /css/style.css',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app.listen(0))
                .get('/css/style.css')
                .expect(200,done);
            }
        );

        it('OK /js/index.js',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app.listen(0))
                .get('/js/index.js')
                .expect(200,done);
            }
        );

        it('OK /test.json',
            (done) => {
                let app = flicker();
                app.noLog();
                app.use(app.serveStatic('examples/public'));
                request(app.listen(0))
                .get('/test.json')
                .expect(200,done);
            }
        );
    }
);
