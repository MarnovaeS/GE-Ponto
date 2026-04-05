export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  // REMOVIDO: password nunca deve ser armazenado no Firestore
  // A autenticação é gerenciada exclusivamente pelo Firebase Auth
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
  location: GeoLocation | null; // null quando usuário nega permissão de GPS
  address?: string;
  deviceInfo: string;
}

export interface AppState {
  currentUser: User | null;
  punches: TimePunch[];
  users: User[];
}
