import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection, onSnapshot, query, orderBy, limit,
  doc, setDoc, updateDoc, deleteDoc, addDoc, where
} from "firebase/firestore";
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

// Detecta modo Demo: Firebase não configurado com credenciais reais
const isDemo = !import.meta.env.VITE_FIREBASE_API_KEY ||
               import.meta.env.VITE_FIREBASE_API_KEY === "AIzaSyAs-SUA-API-KEY";

const App: React.FC = () => {
  const [users, setUsers]               = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser]   = useState<User | null>(null);
  const [punches, setPunches]           = useState<TimePunch[]>([]);
  const [loading, setLoading]           = useState(true);

  // --- Auth listener (produção) ---
  useEffect(() => {
    if (isDemo) {
      console.warn("⚠️ GE-Ponto rodando em modo DEMO. Configure .env.local para produção.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = doc(db, "users", firebaseUser.uid);
        const unsubUser = onSnapshot(userDoc, (snap) => {
          if (snap.exists()) {
            setCurrentUser({ id: snap.id, ...snap.data() } as User);
          }
        });
        return () => unsubUser();
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Sincronização Firestore (produção) ---
  useEffect(() => {
    if (!currentUser || isDemo) return;

    // Limita a 500 registros mais recentes para evitar lentidão
    const qUsers = query(collection(db, "users"), orderBy("name"));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    });

    // Carrega apenas os pontos do mês atual para economizar leituras
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const qPunches = query(
      collection(db, "punches"),
      where("timestamp", ">=", startOfMonth.toISOString()),
      orderBy("timestamp", "desc"),
      limit(500)
    );
    const unsubPunches = onSnapshot(qPunches, (snap) => {
      setPunches(snap.docs.map(d => ({ id: d.id, ...d.data() } as TimePunch)));
    });

    return () => { unsubUsers(); unsubPunches(); };
  }, [currentUser]);

  // --- Login ---
  const handleLogin = async (identifier: string, password?: string) => {
    if (isDemo) {
      // Em modo demo, aceita qualquer senha (não há verificação real)
      const user = MOCK_USERS.find(
        u => u.email === identifier || u.username === identifier
      );
      if (user) {
        setCurrentUser(user);
      } else {
        alert(
          "Usuário demo não encontrado.\n\n" +
          "Tente:\n• admin@empresa.com\n• carla@empresa.com\n• joao@empresa.com\n\n" +
          "Qualquer senha funciona no modo demo."
        );
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, identifier, password ?? "");
    } catch (error: any) {
      const msg = error.code === 'auth/invalid-credential'
        ? "E-mail ou senha incorretos."
        : `Erro ao fazer login: ${error.message}`;
      alert(msg);
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    if (isDemo) { setCurrentUser(null); return; }
    signOut(auth);
  };

  // --- CRUD de Pontos ---
  const addPunch = async (punch: TimePunch) => {
    if (isDemo) { setPunches(prev => [punch, ...prev]); return; }
    await addDoc(collection(db, "punches"), punch);
  };

  // --- CRUD de Usuários ---
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
    if (!window.confirm('Deseja remover este colaborador?')) return;
    if (isDemo) { setUsers(p => p.filter(u => u.id !== id)); return; }
    await deleteDoc(doc(db, "users", id));
  };

  // --- Loading screen ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-6">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-indigo-400 font-black tracking-widest text-[10px] uppercase">
        Inicializando GE-Ponto
      </p>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={!currentUser ? <Login onLogin={handleLogin} isDemo={isDemo} /> : <Navigate to="/" />}
        />
        <Route element={currentUser ? <Layout user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route
            path="/"
            element={
              <PunchClock
                user={currentUser}
                onPunch={addPunch}
                lastPunch={punches.find(p => p.userId === currentUser?.id)}
              />
            }
          />
          <Route
            path="/history"
            element={<History punches={punches.filter(p => p.userId === currentUser?.id)} user={currentUser} />}
          />
          {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.MANAGER) && (
            <Route path="/dashboard" element={<Dashboard punches={punches} users={users} />} />
          )}
          {currentUser?.role === UserRole.ADMIN && (
            <Route
              path="/users"
              element={
                <UserManagement
                  users={users}
                  onAdd={handleAddUser}
                  onUpdate={handleUpdateUser}
                  onDelete={handleDeleteUser}
                />
              }
            />
          )}
          <Route path="/docs" element={<SystemDocs />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
