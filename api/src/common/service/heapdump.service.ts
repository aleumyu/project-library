import { Injectable, Logger } from '@nestjs/common';
import * as heapdump from 'heapdump';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class HeapdumpService {
  private readonly logger = new Logger(HeapdumpService.name);
  private readonly dumpDir = path.join(process.cwd(), 'heapdumps');

  constructor() {
    if (!fs.existsSync(this.dumpDir)) {
      fs.mkdirSync(this.dumpDir, { recursive: true });
      this.logger.log(`Created heapdump directory: ${this.dumpDir}`);
    }
  }

  triggerHeapSnapshot(filenamePrefix: string = 'manual-dump'): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = path.join(
        this.dumpDir,
        `${filenamePrefix}-${Date.now()}.heapsnapshot`,
      );
      this.logger.log(`Attempting to write heap snapshot to: ${filename}`);

      heapdump.writeSnapshot(filename, (err, writtenFilename) => {
        if (err) {
          this.logger.error('Error writing heap snapshot:', err);
          return reject(err);
        }
        this.logger.log(
          `Heap snapshot successfully written to: ${writtenFilename}`,
        );
        resolve(writtenFilename as string);
      });
    });
  }
}
