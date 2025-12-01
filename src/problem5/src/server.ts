import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from './config';
import { connectToDatabase } from './db';
import routes from './routes';

const createApp = (): Application => {
  const app = express();
  app.use(express.json());
  app.get('/health', (_, res) => res.json({ status: 'ok' }));
  app.use(config.apiPrefix, routes);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const message = error.message || 'Unexpected error';
    res.status(500).json({ message });
  });

  return app;
};

const startServer = async (): Promise<void> => {
  try {
    const app = createApp();
    await connectToDatabase();
    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();

export { createApp };

