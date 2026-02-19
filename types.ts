export enum UserLevel {
  GUEST = 'GUEST',
  SEMILLA = 'SEMILLA', // Level 1 - $2
  CRECIMIENTO = 'CRECIMIENTO', // Level 2 - $6
  COSECHA = 'COSECHA' // Level 3 - $20
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  INACTIVE = 'INACTIVE'
}

export interface CycleRecord {
  cycle: number;
  completedAt: number;
  earnings: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  sponsorId: string | null;
  level: UserLevel;
  status: UserStatus;
  cycle: number;
  cycleHistory: CycleRecord[];
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    phone: string;
    idNumber: string;
  } | null;
  earnings: number;
  matrixProgress: number; // 0 to 100
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  isLocked: boolean;
  isCustom?: boolean;
}

export interface PaymentRecord {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPUTED';
  receiptUrl?: string;
  timestamp: number;
  levelTarget: UserLevel;
}
