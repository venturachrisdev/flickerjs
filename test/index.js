var should = require('should');
var assert = require('assert');
var request = require('supertest');
var bodyparser = require('body-parser');
var flicker = require('../');

describe('App',
    () => {
        it('should be callable',
            () => {
                var app = flicker();
                assert.equal(typeof app,'object');
            }
        );
    }
);
describe('Router statusCodes',
    () => {
        it('statusCode should be 200',
            (done) => {
                var app = flicker();
                app.use((req,res) => {
                    res.status(200).end();
                });
                request(app.listen(0))
                .get('/')
                .expect(200,done);

        });
        it('statusCode should be 404',
            (done) => {
                var app = flicker();
                request(app.listen(0))
                .get('/anyurl')
                .expect(404,done);

        });
        it('statusCode should be 201',
            (done) => {
                var app = flicker();
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
                var app = flicker();
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

describe('Response Object',
    () => {
        it('Response end()',
            (done) => {
                var app = flicker();
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
                var app = flicker();
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
                var app = flicker();
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

        it('Response json()',
            (done) => {
                var app = flicker();
                app.use(
                    (req,res) => {
                        res.json({ foo: 'bar'} );
                    }
                );

                request(app.listen(0))
                .get('/')
                .expect(200,{ foo:'bar' },done);
            }
        );
        it('Response locals should be inherited',
            (done) => {
                var app = flicker();
                app.use((req,res,next) => {
                    res.locals = { user: 'me' };
                    next();
                });

                app.use('/anyurl',(req,res,next) => {
                    res.send(res.locals.user);
                });
                request(app.listen(0))
                .get('/anyurl')
                .expect(200,'me',done);
        });
    }
);

describe('Request Object',
    () => {
        it('Request body should be inherited',
            (done) => {
                var app = flicker();
                var router = app.Router();
                app.use(bodyparser.json());
                router.post('/anyurl',(req,res,next) => {
                    res.send(req.body.name);
                });
                request(app.listen(0))
                .post('/anyurl')
                .send({
                    name: 'me'
                })
                .expect(200,'me',done);
        });
    }
);
