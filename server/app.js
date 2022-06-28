// app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
// load in the environment vars
import dotenv from 'dotenv';
dotenv.config({silent: true});

var app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// enable CORS for all routes and for our specific API-Key header
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type, API-Key');
    next();
  })

// PROTECT ALL ROUTES THAT FOLLOW
app.use((req, res, next) => {
    const apiKey = req.get('API-Key')
    if (!apiKey || apiKey !== process.env.API_KEY) {
      res.status(401).json({error: 'unauthorised'})
    } else {
      next()
    }
  })

app.use('/cowin/cert/veryfy/', indexRouter);

export default app;