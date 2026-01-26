// all important modules
const process = require('process');
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const http = require('http');
require('dotenv').config();
// cookie & session 
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.use(express.static('public'));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// app.use(express.urlencoded({ extended: false }));
// import express, { static, urlencoded } from 'express';
// import { createConnection } from 'mysql';
// const app = express();

// set assets path
app.use('/assets', express.static('assets'));

// entended config
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
// app.use(methodOverride("_method"));

app.set('json spaces', 2);
app.use((req, res, next) => {

    return next();
});

// include router
const apiRouter = require("./routes/apiRouter");
app.use("/api", apiRouter);

// start server
let appListen = app.listen(process.env.PORT || 30000, () => {
    console.log("[%s] Express server listening on port %d in %s mode", new Date().toLocaleString(), appListen.address().port, app.settings.env);
});
// app.set('port', process.env.PORT || 30000);
// http.createServer(app).listen(app.get('port'), () => {
//     console.log(`[${new Date().toLocaleString()}] Express server listening on port ${app.get('port')}`);
// });
