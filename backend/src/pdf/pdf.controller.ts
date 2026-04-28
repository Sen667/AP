import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AutorisationDto } from './dto/autorisation.dto';
import { PdfService } from './pdf.service';

@ApiTags("PDF")
@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) { }

    @Post('autorisation')
    async generateAutorisation(
        @Body() dto: AutorisationDto,
        @Res() res: Response,
    ) {
        const pdf = await this.pdfService.generateAutorisation(dto);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="autorisation.pdf"',
            'Content-Length': pdf.length,
        });

        res.end(pdf);
    }
}
