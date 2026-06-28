import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes.js';
import { handleErrors } from './controllers/taskController.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

app.use('/api/tasks', taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(handleErrors);

export default app;
