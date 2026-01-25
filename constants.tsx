
import { UserRole, User, PunchType } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Ricardo Admin', 
    username: 'admin', 
    password: '123', 
    email: 'admin@empresa.com', 
    role: UserRole.ADMIN, 
    avatar: 'https://picsum.photos/seed/admin/200' 
  },
  { 
    id: '2', 
    name: 'Carla Gestora', 
    username: 'carla', 
    password: '123', 
    email: 'carla@empresa.com', 
    role: UserRole.MANAGER, 
    department: 'RH', 
    avatar: 'https://picsum.photos/seed/carla/200' 
  },
  { 
    id: '3', 
    name: 'João Silva', 
    username: 'joao', 
    password: '123', 
    email: 'joao@empresa.com', 
    role: UserRole.EMPLOYEE, 
    department: 'TI', 
    avatar: 'https://picsum.photos/seed/joao/200' 
  },
];

export const PUNCH_LABELS: Record<PunchType, string> = {
  IN: 'Entrada',
  LUNCH_OUT: 'Saída Almoço',
  LUNCH_IN: 'Retorno Almoço',
  OUT: 'Saída'
};

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gestor',
  [UserRole.EMPLOYEE]: 'Funcionário'
};
