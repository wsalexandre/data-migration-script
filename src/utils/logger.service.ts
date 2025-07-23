import * as fs from 'fs';
import * as path from 'path';

export class LoggerService {
  private logPath: string;
  private startedAt: Date;  

  constructor(filename = 'migration.log') {
    const logsDir = path.resolve(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logPath = path.join(logsDir, filename);
    this.startedAt = new Date();
    this.log(`--- Migration started at ${this.startedAt.toISOString()} ---`);
  }

  getLogFilePath(): string {
    return this.logPath;
  }

  log(message: string) {
    const line = `[${new Date().toISOString()}] ${message}`;
    console.log(line);
    try {
      fs.appendFileSync(this.logPath, line + '\n', { encoding: 'utf8' });
    } catch (err) {
      console.error('XXX Failed to write log: XXX', err);
    }
  }

  logError(error: Error | string) {
    this.log('ERROR: ' + (error instanceof Error ? error.stack || error.message : error));
  }

  logSkipped(row: any, reason: string) {
    this.log(`SKIPPED: ${reason} - ${JSON.stringify(row)}`);
  }

  end() {
    const finishedAt = new Date();
    this.log(`--- Migration finished at ${finishedAt.toISOString()} ---`);
  }
}
