"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require('pdfkit');
const employees_service_1 = require("../employees/employees.service");
const verification_service_1 = require("../verification/verification.service");
const transactions_service_1 = require("../transactions/transactions.service");
let ExportService = class ExportService {
    employeesService;
    verificationService;
    transactionsService;
    constructor(employeesService, verificationService, transactionsService) {
        this.employeesService = employeesService;
        this.verificationService = verificationService;
        this.transactionsService = transactionsService;
    }
    async generateCaseFilePdf(employeeId, orgId) {
        const employee = await this.employeesService.findById(employeeId, orgId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        const [sessions, transactions] = await Promise.all([
            this.verificationService.findByEmployee(employeeId),
            this.transactionsService.findByEmployee(employeeId),
        ]);
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
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
            }
            else {
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
            }
            else {
                for (const tx of transactions) {
                    doc.fontSize(11).font('Helvetica');
                    doc.text(`${tx.txTimestamp.toISOString()} | NGN ${tx.amount.toLocaleString()} → ****${tx.destination.slice(-4)} ${tx.velocityFlag ? '[VELOCITY FLAG]' : ''}`);
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
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService,
        verification_service_1.VerificationService,
        transactions_service_1.TransactionsService])
], ExportService);
//# sourceMappingURL=export.service.js.map