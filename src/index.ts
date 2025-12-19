import express, { type Request, type Response, type Express } from 'express';
import { PORT } from './config/server.config.js';
import apiRouter from './routes/index.js';

const app: Express = express();

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});