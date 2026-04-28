import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import puppeteer, { Browser } from 'puppeteer';
import { AutorisationDto } from './dto/autorisation.dto';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PdfService.name);
  private browser!: Browser;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  async onModuleInit(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    this.registerHandlebarsHelpers();
    this.preloadTemplates();

    this.logger.log('Service PDF prêt.');
  }

  /**
   * Enregistre les helpers Handlebars personnalisés
   */
  private registerHandlebarsHelpers(): void {
    // Helper pour générer une signature stylisée
    Handlebars.registerHelper('signature', function (nom: string) {
      if (!nom || nom.trim() === '') return '';

      return new Handlebars.SafeString(
        `<span style="font-family: 'Brush Script MT', 'Segoe Script', cursive; font-size: 32px; font-style: italic; font-weight: 400; color: #1a1a1a;">${nom}</span>`,
      );
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.logger.log('Browser Puppeteer fermé.');
    }
  }

  private preloadTemplates(): void {
    const templateDir = path.join(__dirname, 'templates');

    if (!fs.existsSync(templateDir)) {
      this.logger.warn(`Dossier templates introuvable : ${templateDir}`);
      return;
    }

    const files = fs.readdirSync(templateDir);

    files.forEach((file) => {
      if (!file.endsWith('.html')) return;

      const templateName = path.basename(file, '.html');
      const content = fs.readFileSync(path.join(templateDir, file), 'utf-8');

      const compiled = Handlebars.compile(content);
      this.templateCache.set(templateName, compiled);
    });
  }

  private getTemplate(templateName: string): HandlebarsTemplateDelegate {
    const template = this.templateCache.get(templateName);

    if (!template) {
      throw new Error(`Template "${templateName}" non trouvé`);
    }

    return template;
  }

  private buildHtml(
    templateName: string,
    data: Record<string, unknown>,
  ): string {
    const template = this.getTemplate(templateName);
    return template(data);
  }

  async generateAutorisation(dto: AutorisationDto): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Puppeteer non initialisé');
    }

    const templateData = {
      parents_nom: dto.parentsNom,
      parent1_nom: dto.parent1Nom ?? '',
      parent2_nom: dto.parent2Nom ?? '',
      personne1_nom: dto.personne1Nom,
      personne2_nom: dto.personne2Nom ?? '',
      fait_a: dto.faitA,
      date: dto.date,
    };

    const html = this.buildHtml('personne-autorisee', templateData);

    const page = await this.browser.newPage();

    try {
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      });

      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error('Erreur lors de la génération du PDF', error);
      throw error;
    } finally {
      await page.close();
    }
  }
}
