import { Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';

interface QrOptions {
  width?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

@Injectable()
export class QrService {
  private logger = new Logger(QrService.name);
  private readonly defaultOptions: QrOptions = {
    width: 400,
    errorCorrectionLevel: 'H',
  };

  async toBuffer(url: string, options?: QrOptions): Promise<Buffer> {
    try {
      if (!url || typeof url !== 'string') {
        throw new Error('URL must be a valid string');
      }

      const mergedOptions = { ...this.defaultOptions, ...options };

      this.logger.debug(`Generating QR code for URL: ${url}`);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const buffer = await QRCode.toBuffer(url, {
        type: 'png',
        errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
        width: mergedOptions.width,
      });

      this.logger.log(
        `QR code generated successfully (${buffer.length} bytes)`,
      );
      return buffer;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to generate QR code: ${errorMessage}`, error);
      // Re-throw as Error type for type safety

      throw error instanceof Error ? error : new Error(errorMessage);
    }
  }
}
