import { Injectable } from '@nestjs/common';
import { renderToStream } from '@react-pdf/renderer';
import { ServiceOrderPdf } from './service-order-pdf.js';
import { ChecklistPdf } from './checklist-pdf.js';
import { ServiceOrderReceiptPdf } from './service-order-receipt-pdf.js';
import type { EntryChecklistWithRelations, ServiceOrderReceiptData, ServiceOrderWithRelations } from './pdf.types.js';

@Injectable()
export class PdfService {
  async generateServiceOrderPdf(os: ServiceOrderWithRelations) {
    return renderToStream(<ServiceOrderPdf os={os} />);
  }

  async generateChecklistPdf(checklist: EntryChecklistWithRelations) {
    return renderToStream(<ChecklistPdf checklist={checklist} />);
  }

  async generateServiceOrderReceiptPdf(os: ServiceOrderReceiptData) {
    return renderToStream(<ServiceOrderReceiptPdf os={os} />);
  }
}
