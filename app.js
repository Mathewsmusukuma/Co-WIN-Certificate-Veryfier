
import { certificateStatus } from './cowinVeryfier.mjs';
import express from 'express';
import logger from 'morgan';

// load in the environment vars
import dotenv from 'dotenv';
dotenv.config({silent: true});

const app = express()

app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

app.use(logger('dev'))

// enable CORS for all routes and for our specific API-Key header
app.use(function (req, res, next) {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,POST');
  res.append('Access-Control-Allow-Headers', 'Content-Type, API-Key');
  next();
})

// ROUTES

// UNPROTECTED ROOTES HERE

// PROTECT ALL ROUTES THAT FOLLOW
app.use((req, res, next) => {
  const apiKey = req.get('API-Key')
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({error: 'unauthorised'})
  } else {
    next()
  }
})

// protected route 
app.post('/cowin/cert/veryfy', async (req, res, next) => {
  try {
    const certData = req.body.cert;
    console.log("data is ",certData);
    const response = await certificateStatus(certData);
    res.json({message: response.message})
  } catch (error) {
    // Passes errors into the error handler
    return next(error)
  }
})

// START SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server Listening on port ${process.env.PORT}`)
})
