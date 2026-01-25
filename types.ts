
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  username: string; // Novo campo
  password: string; // Novo campo
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export type PunchType = 'IN' | 'LUNCH_OUT' | 'LUNCH_IN' | 'OUT';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface TimePunch {
  id: string;
  userId: string;
  timestamp: string;
  type: PunchType;
  location: GeoLocation;
  address?: string; // Optional resolved address
  deviceInfo: string;
}

export interface AppState {
  currentUser: User | null;
  punches: TimePunch[];
  users: User[];
}
