
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, doc, setDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { auth, db } from './firebaseConfig';
import { User, TimePunch, UserRole } from './types';
import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import PunchClock from './views/PunchClock';
import History from './views/History';
import UserManagement from './views/UserManagement';
import SystemDocs from './views/SystemDocs';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [punches, setPunches] = useState<TimePunch[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Escutar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Buscar dados do perfil do usuário no Firestore
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
  }, []);

  // 2. Escutar lista de usuários (apenas para Admin/Manager)
  useEffect(() => {
    if (!currentUser || currentUser.role === UserRole.EMPLOYEE) return;

    const q = query(collection(db, "users"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const usersList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersList);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // 3. Escutar batidas de ponto
  useEffect(() => {
    if (!currentUser) return;

    // Se for admin, vê tudo. Se for funcionário, vê só as dele.
    const punchesRef = collection(db, "punches");
    const q = currentUser.role === UserRole.ADMIN 
      ? query(punchesRef, orderBy("timestamp", "desc"))
      : query(punchesRef, orderBy("timestamp", "desc")); // Em prod, adicionar filtro where("userId", "==", currentUser.id)

    const unsubscribe = onSnapshot(q, (snap) => {
      const punchList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimePunch));
      setPunches(punchList);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleLogin = async (identifier: string, password?: string) => {
    try {
      // Nota: Em produção, você mapearia 'username' para 'email' ou usaria login customizado
      // Aqui simplificamos assumindo que o login é por email
      await signInWithEmailAndPassword(auth, identifier, password || "");
    } catch (error: any) {
      alert(`Erro no login: ${error.message}`);
    }
  };

  const handleLogout = () => signOut(auth);

  const addPunch = async (punch: TimePunch) => {
    await addDoc(collection(db, "punches"), punch);
  };

  const handleAddUser = async (user: User) => {
    // Nota: Em prod, criar o usuário no Firebase Auth via Cloud Function
    // Aqui apenas salvamos o documento do perfil
    await setDoc(doc(db, "users", user.id), user);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const { id, ...data } = updatedUser;
    await updateDoc(doc(db, "users", id), data);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Remover colaborador e dados permanentemente?')) {
      await deleteDoc(doc(db, "users", id));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
