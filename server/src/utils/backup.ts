import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import logger from '../config/logging';

const execAsync = promisify(exec);

interface BackupConfig {
  backupDir: string;
  retentionDays: number;
  databaseUrl: string;
  redisUrl: string;
}

class BackupManager {
  private config: BackupConfig;

  constructor(config: BackupConfig) {
    this.config = config;
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true });
    }
  }

  private getBackupFileName(type: 'db' | 'redis'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${type}-backup-${timestamp}.gz`;
  }

  async backupDatabase(): Promise<string> {
    try {
      const backupFile = path.join(this.config.backupDir, this.getBackupFileName('db'));
      const command = `pg_dump "${this.config.databaseUrl}" | gzip > "${backupFile}"`;
      
      await execAsync(command);
      logger.info(`Database backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      logger.error('Database backup failed:', error);
      throw error;
    }
  }

  async backupRedis(): Promise<string> {
    try {
      const backupFile = path.join(this.config.backupDir, this.getBackupFileName('redis'));
      const command = `redis-cli -u "${this.config.redisUrl}" SAVE && cp /var/lib/redis/dump.rdb "${backupFile}"`;
      
      await execAsync(command);
      logger.info(`Redis backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      logger.error('Redis backup failed:', error);
      throw error;
    }
  }

  async cleanupOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.config.backupDir);
      const now = new Date();
      
      for (const file of files) {
        const filePath = path.join(this.config.backupDir, file);
        const stats = fs.statSync(filePath);
        const daysOld = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysOld > this.config.retentionDays) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Backup cleanup failed:', error);
      throw error;
    }
  }

  async performFullBackup(): Promise<{ db: string; redis: string }> {
    try {
      const dbBackup = await this.backupDatabase();
      const redisBackup = await this.backupRedis();
      await this.cleanupOldBackups();
      
      return {
        db: dbBackup,
        redis: redisBackup
      };
    } catch (error) {
      logger.error('Full backup failed:', error);
      throw error;
    }
  }
}

export default BackupManager; 