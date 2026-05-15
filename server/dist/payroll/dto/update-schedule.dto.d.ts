export declare class SalaryAmountDto {
    employeeId: string;
    amount: number;
}
export declare class UpdateScheduleDto {
    disbursementDay?: number;
    smsHoursBefore?: number;
    salaryAmounts?: SalaryAmountDto[];
    squadApiKey?: string;
}
