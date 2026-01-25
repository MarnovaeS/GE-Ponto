
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Bater Ponto', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { path: '/history', label: 'Meu Histórico', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { path: '/dashboard', label: 'Painel Geral', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z', roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { path: '/users', label: 'Colaboradores', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', roles: [UserRole.ADMIN] },
    { path: '/docs', label: 'Arquitetura', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl">PS</div>
          <span className="text-xl font-bold tracking-tight">PontoSmart</span>
        </div>

        <nav className="flex-1 space-y-1">
          {filteredItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm">Sair do Sistema</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
