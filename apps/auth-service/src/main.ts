import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors(
  {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
));

app.get('/', (req, res) => {
  res.send({ message: 'Hello API  with api gateway proxy pass' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 6001;
const server = app.listen(port, () => {
  console.log(`[ ready ] Auth service listening at http://localhost:${port}`);
})


server.on('error', (err)=>{
  console.log("auth service error",err);
});