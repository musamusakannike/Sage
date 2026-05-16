import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import {
  PayrollSchedule,
  PayrollScheduleDocument,
} from './schemas/payroll-schedule.schema';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

const ALGORITHM = 'aes-256-cbc';

@Injectable()
export class PayrollService {
  private readonly encryptionKey: Buffer;

  constructor(
    @InjectModel(PayrollSchedule.name)
    private scheduleModel: Model<PayrollScheduleDocument>,
    private configService: ConfigService,
  ) {
    const key = this.configService.get<string>('app.encryptionKey')!;
    this.encryptionKey = Buffer.from(key.padEnd(32).slice(0, 32));
  }

  async getOrCreate(orgId: string): Promise<PayrollScheduleDocument> {
    if (!orgId || !Types.ObjectId.isValid(orgId)) {
      throw new NotFoundException('Organisation not found.');
    }
    let schedule = await this.scheduleModel
      .findOne({ orgId: new Types.ObjectId(orgId) })
      .lean()
      .exec();
    if (!schedule) {
      const created = await this.scheduleModel.create({
        orgId: new Types.ObjectId(orgId),
        disbursementDay: 25,
        smsHoursBefore: 24,
      });
      return created;
    }
    return schedule as PayrollScheduleDocument;
  }

  async update(orgId: string, dto: UpdateScheduleDto): Promise<PayrollScheduleDocument> {
    const updateData: Record<string, unknown> = {};

    if (dto.disbursementDay !== undefined)
      updateData.disbursementDay = dto.disbursementDay;
    if (dto.smsHoursBefore !== undefined)
      updateData.smsHoursBefore = dto.smsHoursBefore;
    if (dto.salaryAmounts !== undefined) {
      updateData.salaryAmounts = dto.salaryAmounts.map((s) => ({
        employeeId: new Types.ObjectId(s.employeeId),
        amount: s.amount,
      }));
    }
    if (dto.squadApiKey) {
      updateData.encryptedSquadApiKey = this.encrypt(dto.squadApiKey);
    }

    const updated = await this.scheduleModel
      .findOneAndUpdate(
        { orgId: new Types.ObjectId(orgId) },
        { $set: updateData },
        { new: true, upsert: true },
      )
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('Schedule not found.');
    return updated as PayrollScheduleDocument;
  }

  async getDecryptedSquadKey(orgId: string): Promise<string | null> {
    const schedule = await this.scheduleModel
      .findOne({ orgId: new Types.ObjectId(orgId) })
      .lean()
      .exec();
    if (!schedule?.encryptedSquadApiKey) return null;
    return this.decrypt(schedule.encryptedSquadApiKey);
  }

  getNextDisbursementDate(disbursementDay: number): Date {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), disbursementDay);
    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }
    return next;
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, this.encryptionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, dataHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, this.encryptionKey, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
