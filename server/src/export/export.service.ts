import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit') as typeof import('pdfkit');
import { EmployeesService } from '../employees/employees.service';
import { VerificationService } from '../verification/verification.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ExportService {
  constructor(
    private employeesService: EmployeesService,
    private verificationService: VerificationService,
    private transactionsService: TransactionsService,
  ) {}

  async generateCaseFilePdf(
    employeeId: string,
    orgId: string,
  ): Promise<Buffer> {
    const employee = await this.employeesService.findById(employeeId, orgId);
    if (!employee) throw new NotFoundException('Employee not found.');

    const [sessions, transactions] = await Promise.all([
      this.verificationService.findByEmployee(employeeId),
      this.transactionsService.findByEmployee(employeeId),
    ]);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Sage AI — Case File', { align: 'center' });

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Generated: ${new Date().toISOString()}`, { align: 'center' });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      doc.fontSize(14).font('Helvetica-Bold').text('Employee Information');
      doc.fontSize(11).font('Helvetica');
      doc.text(`Name: ${employee.name}`);
      doc.text(`Role: ${employee.roleTitle}`);
      doc.text(`Account: ${employee.accountNumber}`);
      doc.text(`Phone: ${employee.phone}`);
      doc.text(`Current Status: ${employee.status}`);
      doc.text(`DNA Score: ${employee.dnaScore ?? 'Not yet scored'}`);
      doc.moveDown();

      doc.fontSize(14).font('Helvetica-Bold').text('Verification Sessions');
      if (sessions.length === 0) {
        doc.fontSize(11).font('Helvetica').text('No verification sessions recorded.');
      } else {
        for (const session of sessions) {
          doc.fontSize(11).font('Helvetica');
          doc.text(`Date: ${session.verifiedAt?.toISOString() ?? 'N/A'}`);
          doc.text(`Total DNA Score: ${session.totalDnaScore ?? 'N/A'}`);
          doc.text(`Liveness: ${session.livenessPasssed ? 'PASSED' : 'FAILED'}`);
          doc.text(`Device: ${session.deviceFingerprint?.slice(0, 12) ?? 'N/A'}...`);
          doc.text(`GPS Captured: ${session.gpsCaptured ? 'Yes' : 'No'}`);
          doc.moveDown(0.5);
        }
      }

      doc.moveDown();
      doc.fontSize(14).font('Helvetica-Bold').text('Transaction Timeline');
      if (transactions.length === 0) {
        doc.fontSize(11).font('Helvetica').text('No transactions recorded.');
      } else {
        for (const tx of transactions) {
          doc.fontSize(11).font('Helvetica');
          doc.text(
            `${tx.txTimestamp.toISOString()} | NGN ${tx.amount.toLocaleString()} → ****${tx.destination.slice(-4)} ${tx.velocityFlag ? '[VELOCITY FLAG]' : ''}`,
          );
        }
      }

      doc.moveDown();
      doc
        .fontSize(9)
        .font('Helvetica')
        .text('This document is system-generated and tamper-evident.', {
          align: 'center',
        });

      doc.end();
    });
  }
}
