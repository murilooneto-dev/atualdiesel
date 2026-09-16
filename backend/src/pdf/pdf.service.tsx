import { Injectable } from '@nestjs/common';
import { renderToStream } from '@react-pdf/renderer';
import { ServiceOrderPdf } from './service-order-pdf.js';
import type { ServiceOrderWithRelations } from './pdf.types.js';

@Injectable()
export class PdfService {
  async generateServiceOrderPdf(os: ServiceOrderWithRelations) {
    return renderToStream(<ServiceOrderPdf os={os} />);
  }
}
