import { Router, Request, Response } from 'express';
import { MonitoringService } from '../services/monitoringService';

const router = Router();
const monitoringService = new MonitoringService();

router.get('/cpu', async (req: Request, res: Response) => {
  try {
    const stats = await monitoringService.getCpuStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/memory', async (req: Request, res: Response) => {
  try {
    const stats = await monitoringService.getMemoryStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/disk', async (req: Request, res: Response) => {
  try {
    const stats = await monitoringService.getDiskIOStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/network', async (req: Request, res: Response) => {
  try {
    const stats = await monitoringService.getNetworkStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/processes', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const processes = await monitoringService.getTopProcesses(limit);
    res.json(processes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    const stats = await monitoringService.getAllStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as monitoringRoutes };

