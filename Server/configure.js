var path = require('path')
routes = require('./routes'),
exphbs = require('express-handlebars'),
express = require('express'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
morgan = require('morgan'),
methodOverride = require('method-override'),
errorHandler = require('errorhandler'),
moment = require('moment'),
multer  = require('multer');   // for multi part form submission


module.exports = function(app) {
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':true}));
    //app.use(bodyParser.json());   //supports JSON and URLs only
    //support multipart form submission
    
    //app.use(multer({dest: path.join(__dirname,
    //    'Public/upload/temp')}));
    app.use(methodOverride());
    app.use(cookieParser('some-secret-value-here'));

    routes(app);  //moving the routes to routes folder.

    app.use('/Public/', express.static(path.join(__dirname,'../Public')));

    if ('development' === app.get('env')) {
        app.use(errorHandler());
        }

    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf('minute').fromNow();   //moment pakage
                }
            }
        }).engine);
        
    app.set('view engine', 'handlebars');    // view engine i.e.  handlebars, Jade etc

    return app;
    };