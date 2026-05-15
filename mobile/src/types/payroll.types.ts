export interface SalaryEntry {
  employeeId: string;
  amount: number;
}

export interface PayrollSchedule {
  _id: string;
  orgId: string;
  disbursementDay: number;
  smsHoursBefore: number;
  salaryAmounts: SalaryEntry[];
  encryptedSquadApiKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSchedulePayload {
  disbursementDay?: number;
  smsHoursBefore?: number;
  squadApiKey?: string;
}
