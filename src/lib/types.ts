import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'Worker' | 'Supervisor' | 'SafetyManager';

export interface AppUser {
  uid: string;
  email: string | null;
  name: string;
  role: UserRole;
}

export interface ChecklistTemplate {
  id: string;
  workType: string;
  version: number;
  items: Array<{
    id: string;
    text: string;
    required: boolean;
  }>;
}

export interface ChecklistResponse {
  itemId: string;
  answer: 'Yes' | 'No' | null;
  photoUrl?: string;
}

export interface Checklist {
  id: string;
  templateId: string;
  workType: string;
  userId: string;
  userName: string;
  status: 'in-progress' | 'submitted' | 'approved' | 'rejected';
  responses: ChecklistResponse[];
  createdAt: Timestamp;
  submittedAt?: Timestamp;
  approvedAt?: Timestamp;
  rejectedAt?: Timestamp;
  riskLevel: 'Safe' | 'Warning' | 'Danger' | null;
  hasRisks: boolean; // True if any answer is 'No'
}
