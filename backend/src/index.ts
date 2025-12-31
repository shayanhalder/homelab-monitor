import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { monitoringRoutes } from './routes/monitoring';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/monitoring', monitoringRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Homelab Monitor API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

