import express from 'express';
import cors from 'cors';
import router from './routes/domainRoutes';
import authRouter from './routes/authRoutes';
import { config } from './config/environment.js';

const app = express();

app.use(cors({
    origin: config.CORS_ORIGIN
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(`/api/${config.API_VERSION}/domains`, router);
app.use(`/api/${config.API_VERSION}/auth`, authRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;