import express from 'express';
import cors from 'cors';
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import  SwaggerUi from 'swagger-ui-express';
// const swaggerDocument = require('./swagger-output.json');
import path from 'path';
import fs from 'fs';
// const swaggerPath = path.resolve(__dirname, '../../../src/swagger-output.json');

const swaggerPath = path.resolve(__dirname, './swagger-output.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
// console.log(path.resolve(__dirname));

const app = express();

app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API  with api gateway proxy pass' });
});

app.use("/api-docs",SwaggerUi.serve,SwaggerUi.setup(swaggerDocument));
app.get("/docs-json",(req,res,next)=>{
  res.json(swaggerDocument);
})
// Routes
app.use("/api/v1/",router)



const port = process.env.PORT ? Number(process.env.PORT) : 6001;
const server = app.listen(port, () => {
  console.log(`[ ready ] Auth service listening at http://localhost:${port}`);
  console.log("Swagger UI at http://localhost:6001/docs-json");
})


server.on('error', (err)=>{
  console.log("auth service error",err);
});