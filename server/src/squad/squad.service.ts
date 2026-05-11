import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class SquadService {
  private readonly logger = new Logger(SquadService.name);
  private readonly baseUrl = 'https://sandbox-api-d.squadco.com';

  private getClient(apiKey: string): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async disburse(
    apiKey: string,
    employeeName: string,
    accountNumber: string,
    amount: number,
    reference: string,
  ): Promise<{ success: boolean; reference: string }> {
    try {
      const client = this.getClient(apiKey);
      const response = await client.post<{ status: number }>('/payout/initiate', {
        transaction_reference: reference,
        amount: amount * 100,
        bank_code: '058',
        account_number: accountNumber,
        account_name: employeeName,
        currency_id: 'NGN',
        remark: 'Salary disbursement via Sage AI',
      });

      if (response.data?.status === 200) {
        this.logger.log(`Disbursed to ${accountNumber} — ref: ${reference}`);
        return { success: true, reference };
      }

      this.logger.warn(`Disburse failed for ${accountNumber}`);
      return { success: false, reference };
    } catch (error) {
      this.logger.error(`Squad disburse error: ${(error as Error).message}`);
      return { success: false, reference };
    }
  }

  async blockDisbursement(
    apiKey: string,
    reference: string,
  ): Promise<{ success: boolean }> {
    this.logger.log(`Block disbursement requested: ref ${reference}`);
    return { success: true };
  }
}
