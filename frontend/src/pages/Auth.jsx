import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification'; // Controlla che il percorso sia giusto!

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // STATO DELLA NOTIFICA
  // Importante: deve essere un oggetto con 'message' e 'type'
  const [notif, setNotif] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    
    try {
      const res = await axios.post(`http://localhost:3000${endpoint}`, { email, password });
      
      // ✅ CORRETTO: Passiamo 'message' (non 'testo') e 'type'
      setNotif({ 
        message: isLogin ? "Accesso eseguito! 🎉" : "Registrazione completata!", 
        type: 'success' 
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

      if (isLogin) localStorage.setItem('token', res.data.token);
    } catch (err) {
      // ✅ CORRETTO: Prendiamo il messaggio dal backend o ne usiamo uno di fallback
      const errorMsg = err.response?.data?.message || "Errore di connessione";
      setNotif({ message: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="auth-wrapper">
      {/* NOTIFICA: Controlla che le props siano scritte esattamente così */}
      {notif && (
        <Notification 
          message={notif.message} 
          type={notif.type} 
          onClose={() => setNotif(null)} 
        />
      )}

      <div className="auth-visual">
        <div className="overlay">
          <h1>FintechManager</h1>
          <p>La tua finanza, semplificata.</p>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <h2>{isLogin ? 'Accedi' : 'Registrati'}</h2>
          <form onSubmit={handleAuth}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">{isLogin ? 'Entra' : 'Crea Account'}</button>
          </form>
          <p className="switch-text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;