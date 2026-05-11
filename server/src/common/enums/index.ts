export enum UserRole {
  HR_ADMIN = 'hr_admin',
  AUDITOR = 'auditor',
}

export enum EmployeeStatus {
  CLEAR = 'CLEAR',
  REVIEW = 'REVIEW',
  FROZEN = 'FROZEN',
  PENDING = 'PENDING',
  FLAGGED = 'FLAGGED',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
}

export enum NodeType {
  EMPLOYEE = 'employee',
  DESTINATION = 'destination',
  CONTROLLER = 'controller',
}

export enum RingConfidence {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ScoreThreshold {
  FREEZE = 40,
  REVIEW = 70,
}
