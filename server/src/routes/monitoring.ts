import express from 'express';
import os from 'os';
import { getRedisClient } from '../config/redis';
import logger from '../config/logging';

const router = express.Router();

// Health check endpoint
router.get('/health', (_, res) => {
  res.status(200).json({ status: 'healthy' });
});

// System metrics endpoint
router.get('/metrics', async (_, res) => {
  try {
    const redisClient = getRedisClient();
    const redisInfo = await redisClient.info();
    
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: os.uptime(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuUsage: process.cpuUsage(),
        loadAverage: os.loadavg()
      },
      process: {
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid
      },
      redis: {
        connected: redisClient.isOpen,
        info: redisInfo
      }
    };

    res.status(200).json(metrics);
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Status endpoint
router.get('/status', async (_, res) => {
  try {
    const redisClient = getRedisClient();
    const status = {
      status: 'operational',
      services: {
        api: 'operational',
        redis: redisClient.isOpen ? 'operational' : 'degraded',
        database: 'operational'
      },
      lastChecked: new Date().toISOString()
    };

    res.status(200).json(status);
  } catch (error) {
    logger.error('Error checking status:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

export default router; 