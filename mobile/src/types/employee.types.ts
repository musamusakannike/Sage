export type ServerEmployeeStatus = 'CLEAR' | 'REVIEW' | 'FROZEN' | 'PENDING' | 'FLAGGED';

export interface Employee {
  _id: string;
  orgId: string;
  name: string;
  roleTitle: string;
  accountNumber: string;
  phone: string;
  email: string | null;
  dnaScore: number | null;
  status: ServerEmployeeStatus;
  lastVerifiedAt: string | null;
  deletedAt: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
}
