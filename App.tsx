import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, doc, setDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { auth, db } from './firebaseConfig';
import { User, TimePunch, UserRole } from './types';
import { MOCK_USERS } from './constants';
import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import PunchClock from './views/PunchClock';
import History from './views/History';
import UserManagement from './views/UserManagement';
import SystemDocs from './views/SystemDocs';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [punches, setPunches] = useState<TimePunch[]>([]);
  const [loading, setLoading] = useState(true);

  // Detecção de modo Demo vs Produção
  const isDemo = auth.config.apiKey === "AIzaSyAs-SUA-API-KEY";

  useEffect(() => {
    if (isDemo) {
      console.warn("⚠️ Energe Ponto rodando em modo DEMO. Configure firebaseConfig.ts para produção.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = doc(db, "users", firebaseUser.uid);
        onSnapshot(userDoc, (snap) => {
          if (snap.exists()) {
            setCurrentUser({ id: snap.id, ...snap.data() } as User);
          }
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDemo]);

  // Sincronização de dados
  useEffect(() => {
    if (!currentUser || isDemo) return;

    const qUsers = query(collection(db, "users"), orderBy("name"));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    });

    const qPunches = query(collection(db, "punches"), orderBy("timestamp", "desc"));
    const unsubPunches = onSnapshot(qPunches, (snap) => {
      setPunches(snap.docs.map(d => ({ id: d.id, ...d.data() } as TimePunch)));
    });

    return () => { unsubUsers(); unsubPunches(); };
  }, [currentUser, isDemo]);

  const handleLogin = async (identifier: string, password?: string) => {
    if (isDemo) {
      const user = MOCK_USERS.find(u => u.email === identifier || u.username === identifier);
      if (user && password === "123") {
        setCurrentUser(user);
      } else {
        alert("Usuário demo inválido. Use admin@empresa.com / 123");
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, identifier, password || "");
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleLogout = () => {
    if (isDemo) {
      setCurrentUser(null);
      return;
    }
    signOut(auth);
  };

  const addPunch = async (punch: TimePunch) => {
    if (isDemo) {
      setPunches(prev => [punch, ...prev]);
      return;
    }
    await addDoc(collection(db, "punches"), punch);
  };

  const handleAddUser = async (user: User) => {
    if (isDemo) { setUsers(p => [...p, user]); return; }
    await setDoc(doc(db, "users", user.id), user);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (isDemo) { setUsers(p => p.map(u => u.id === updatedUser.id ? updatedUser : u)); return; }
    const { id, ...data } = updatedUser;
    await updateDoc(doc(db, "users", id), data);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Deseja remover este colaborador?')) return;
    if (isDemo) { setUsers(p => p.filter(u => u.id !== id)); return; }
    await deleteDoc(doc(db, "users", id));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-6">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-indigo-400 font-black tracking-widest text-[10px] uppercase">Inicializando Energe Ponto</p>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route element={currentUser ? <Layout user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/" element={
            <PunchClock 
              user={currentUser} 
              onPunch={addPunch} 
              lastPunch={punches.find(p => p.userId === currentUser?.id)} 
            />
          } />
          
          <Route path="/history" element={<History punches={punches.filter(p => p.userId === currentUser?.id)} user={currentUser} />} />
          
          {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.MANAGER) && (
            <Route path="/dashboard" element={<Dashboard punches={punches} users={users} />} />
          )}
          
          {currentUser?.role === UserRole.ADMIN && (
            <Route path="/users" element={
              <UserManagement 
                users={users} 
                onAdd={handleAddUser}
                onUpdate={handleUpdateUser}
                onDelete={handleDeleteUser}
              />
            } />
          )}

          <Route path="/docs" element={<SystemDocs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;