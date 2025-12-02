import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  private logger = new Logger(QrController.name);

  constructor(private readonly qrService: QrService) {}

  @Get()
  async getQr(
    @Query('url') url: string,
    @Res() res: Response,
    @Query('width') width?: string,
    @Query('errorCorrection') errorCorrection?: 'L' | 'M' | 'Q' | 'H',
  ) {
    try {
      if (!url || typeof url !== 'string') {
        throw new HttpException(
          'URL query parameter is required and must be a valid string',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse optional query parameters
      const options = {
        width: width ? parseInt(width, 10) : undefined,
        errorCorrectionLevel: errorCorrection,
      };

      this.logger.log(`QR code request for URL: ${url}`);

      const buffer = await this.qrService.toBuffer(url, options);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Content-Length', buffer.length.toString());
      return res.send(buffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate QR code';
      this.logger.error(`QR generation error: ${errorMessage}`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
