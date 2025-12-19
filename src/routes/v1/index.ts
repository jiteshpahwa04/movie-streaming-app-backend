import express, { type Request, type Response } from 'express';

const v1Router = express.Router();

v1Router.get('/ping', (_req: Request, res: Response) => { // If we add _ before req, it tells TS that we are intentionally not using this parameter, so no warnings will be shown. We can also use just the _ alone.
    res.status(200).json({
        message: 'pong',
    });
});

export default v1Router;