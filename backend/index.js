import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { blog } from './controllers';
import db from 'mongoose';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import async from 'async';

import ServerRenderingMiddleware from './middleware/serverSideRendering';

import config from './configs/config';

var app = express();

const host = process.env.NODE_ENV == 'development'?config.server.develop:config.server.production;
const port = config.server.port;

function parallel(middlewares) {
    return function(req, res, next) {
        async.each(middlewares, function(mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}

app.use(logger('dev'));

var webpackConfig = null;
if (process.env.NODE_ENV == 'development') {
    webpackConfig = require('../webpack.dev');
} else {
    webpackConfig = require('../webpack.prod');
}
var compiler = webpack(webpackConfig);

// TO DELETE IN PRODUCTION!!!
app.use(function(req, res, next) {
    console.log('TRY ADD HEADERS FOR REQUEST ' + req.url);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

if (process.env.NODE_ENV == 'production') {
    app.use('*.js', setBundleHeaders); // USE GZIP COMPRESSION FOR PRODUCTION BUNDLE
    app.use(root+'dist', express.static(__dirname + '/../dist'));
} else {
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}
app.use(root+'css', express.static(__dirname + '/static/css'));
app.use(root+'images', express.static(__dirname + '/static/images'));
app.use(root+'favicon.ico', express.static(__dirname + '/static/images/favicon.ico'));
app.use(parallel([
    ServerRenderingMiddleware,
    bodyParser.json(),
    cookieParser(),
    bodyParser.urlencoded({
        extended: false
    })
]));

app.use('/css', express.static(__dirname + '/static/css'));
app.get('/blog', blog.getAllPosts);
app.get('/blog/new', blog.blog);
app.post('/blog/new', blog.newPost);
app.get('/blog/:id', blog.blog);
app.post('/blog/addComment', blog.blog);

db.Promise = global.Promise;
db.connect('mongodb://' + config.database.host + '/' + config.database.db);

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(port, host, function(error) {
    if (error) {
      console.error("APP ERROR:")
      console.error(error)
    } else {
        console.info("==> 🌎  Web APP listening on port %s. Open up http://%s:%s/ in your browser.", port, host, port)
    }
})
