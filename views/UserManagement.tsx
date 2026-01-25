
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { ROLE_LABELS } from '../constants';

interface UserManagementProps {
  users: User[];
  onAdd: (user: User) => void;
  onUpdate: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    role: UserRole.EMPLOYEE,
    department: '',
    avatar: ''
  });

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
        department: user.department || '',
        avatar: user.avatar || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        username: '',
        password: '',
        email: '',
        role: UserRole.EMPLOYEE,
        department: '',
        avatar: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const avatarToUse = formData.avatar || `https://picsum.photos/seed/${formData.username || 'default'}/200`;
    
    if (editingUser) {
      onUpdate({ ...editingUser, ...formData, avatar: avatarToUse });
    } else {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        avatar: avatarToUse
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerenciar Colaboradores</h2>
          <p className="text-sm text-slate-500">Controle de acessos e perfis da empresa</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          Novo Colaborador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <img src={user.avatar} className="w-16 h-16 rounded-2xl border-4 border-slate-50 object-cover" alt="" />
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                user.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 
                user.role === UserRole.MANAGER ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
            <div className="flex flex-col gap-0.5 mb-4">
              <p className="text-xs font-bold text-slate-400">@{user.username}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mb-6">{user.department || 'Geral'}</p>
            
            <div className="flex items-center gap-3">
              <button onClick={() => openModal(user)} className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors">Editar</button>
              <button onClick={() => onDelete(user.id)} className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors">Remover</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{editingUser ? 'Editar' : 'Cadastrar'} Colaborador</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center mb-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-3xl border-4 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
                    {formData.avatar ? (
                      <img src={formData.avatar} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Alterar Foto</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome de Usuário</label>
                  <input type="text" required placeholder="ex: joaosilva" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha de Acesso</label>
                  <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">E-mail Corporativo</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Departamento</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Perfil</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                    <option value={UserRole.EMPLOYEE}>Funcionário</option>
                    <option value={UserRole.MANAGER}>Gestor</option>
                    <option value={UserRole.ADMIN}>Administrador</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
