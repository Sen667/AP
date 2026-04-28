import { Logger, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [PdfController],
  providers: [PdfService, Logger],
  exports: [PdfService],
})
export class PdfModule { }
