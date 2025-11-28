import type { UserRole } from './types';

export const ROLES: UserRole[] = ['Worker', 'Supervisor', 'SafetyManager'];

// These are test accounts for the prototype.
// PLEASE CREATE THESE USERS IN YOUR FIREBASE AUTH CONSOLE.
export const TEST_ACCOUNTS = {
  Worker: {
    email: 'worker@safety.com',
    password: 'password',
    name: '기술인',
  },
  Supervisor: {
    email: 'supervisor@safety.com',
    password: 'password',
    name: '관리감독자',
  },
  SafetyManager: {
    email: 'manager@safety.com',
    password: 'password',
    name: '안전관리자',
  },
};
