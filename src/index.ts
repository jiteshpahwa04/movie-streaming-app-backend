import express, { type Request, type Response, type Express } from 'express';

const app: Express = express();

app.get('/ping', (_req: Request, res: Response) => { // If we add _ before req, it tells TS that we are intentionally not using this parameter, so no warnings will be shown. We can also use just the _ alone.
    res.status(200).json({
        message: 'pong',
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});