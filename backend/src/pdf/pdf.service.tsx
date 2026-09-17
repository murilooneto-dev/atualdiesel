import { Injectable } from '@nestjs/common';
import { renderToStream } from '@react-pdf/renderer';
import { ServiceOrderPdf } from './service-order-pdf.js';
import { ChecklistPdf } from './checklist-pdf.js';
import type { EntryChecklistWithRelations, ServiceOrderWithRelations } from './pdf.types.js';

@Injectable()
export class PdfService {
  async generateServiceOrderPdf(os: ServiceOrderWithRelations) {
    return renderToStream(<ServiceOrderPdf os={os} />);
  }

  async generateChecklistPdf(checklist: EntryChecklistWithRelations) {
    return renderToStream(<ChecklistPdf checklist={checklist} />);
  }
}
