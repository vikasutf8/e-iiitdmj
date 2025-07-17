
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import porxy from 'express-http-proxy';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors(
  {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
));

const rateLimiter =rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req:any)=>(req.user ?1000 :100), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: any) => req.ip,
})
 
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(rateLimiter);
app.set('trust proxy', 1);





app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/',porxy("http://localhost:6001"));

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
