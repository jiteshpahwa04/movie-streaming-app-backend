import express, { type Request, type Response, type Express } from 'express';
import { PORT } from './config/server.config.js';
import apiRouter from './routes/index.js';
import cors from 'cors';

const app: Express = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api', apiRouter);

app.use('/outputs', express.static('outputs'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});