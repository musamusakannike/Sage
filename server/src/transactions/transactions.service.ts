import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

interface SquadWebhookPayload {
  transaction_reference: string;
  amount: number;
  destination_account: string;
  account_number: string;
  transaction_date: string;
  transaction_type?: string;
}

const VELOCITY_WINDOW_SECONDS = 90;
const CONVERGENCE_WINDOW_HOURS = 4;

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async processWebhook(
    payload: SquadWebhookPayload,
    orgId: string,
    employeeId: string,
    cycleId?: string,
  ): Promise<void> {
    const txTimestamp = new Date(payload.transaction_date);
    const salaryDisbursedAt = await this.getSalaryDisbursementTime(
      employeeId,
      cycleId,
    );

    const velocityFlag =
      salaryDisbursedAt !== null &&
      txTimestamp.getTime() - salaryDisbursedAt.getTime() <
        VELOCITY_WINDOW_SECONDS * 1000;

    await this.transactionModel.create({
      txId: payload.transaction_reference,
      employeeId: new Types.ObjectId(employeeId),
      orgId: new Types.ObjectId(orgId),
      amount: payload.amount,
      destination: payload.destination_account,
      txTimestamp,
      txType: payload.transaction_type ?? 'transfer',
      velocityFlag,
      isSuspicious: velocityFlag,
      cycleId: cycleId ?? null,
    });

    this.logger.log(
      `Transaction recorded: ${payload.transaction_reference}, velocity=${velocityFlag}`,
    );
  }

  async findByEmployee(
    employeeId: string,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({ employeeId: new Types.ObjectId(employeeId) })
      .sort({ txTimestamp: -1 })
      .lean()
      .exec() as Promise<TransactionDocument[]>;
  }

  async detectConvergingDestinations(
    orgId: string,
    cycleId?: string,
  ): Promise<Array<{ destination: string; employeeIds: string[]; count: number }>> {
    const windowStart = new Date(
      Date.now() - CONVERGENCE_WINDOW_HOURS * 60 * 60 * 1000,
    );

    const pipeline = [
      {
        $match: {
          orgId: new Types.ObjectId(orgId),
          txTimestamp: { $gte: windowStart },
          ...(cycleId ? { cycleId } : {}),
        },
      },
      {
        $group: {
          _id: '$destination',
          employeeIds: { $addToSet: '$employeeId' },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gte: 2 } } },
      { $sort: { count: -1 as -1 } },
    ];

    const results = await this.transactionModel.aggregate<{
      _id: string;
      employeeIds: Types.ObjectId[];
      count: number;
    }>(pipeline).exec();

    return results.map((r) => ({
      destination: r._id,
      employeeIds: r.employeeIds.map((id) => id.toString()),
      count: r.count,
    }));
  }

  private async getSalaryDisbursementTime(
    _employeeId: string,
    _cycleId?: string,
  ): Promise<Date | null> {
    return null;
  }
}
