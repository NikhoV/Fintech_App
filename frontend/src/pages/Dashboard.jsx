import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewAccountDialog from '../components/NewAccountDialog';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Chiamata parallela per ottimizzare i tempi
      const [totalRes, accountsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/conti/total-balance', { headers }),
        axios.get('http://localhost:3000/api/conti/', { headers })
      ]);

      setTotalBalance(totalRes.data.totalBalance);
      setAccounts(accountsRes.data);
    } catch (err) {
      console.error("Errore nel caricamento dati", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAccount = async (newAccountData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/conti/', newAccountData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ricarichiamo tutto per avere il totale aggiornato e la lista fresca
      fetchData(); 
    } catch (err) {
      alert("Errore nel salvataggio del conto");
    }
  };

  if (loading) return <div className="p-10 text-center">Caricamento in corso...</div>;

  return (
  <div className="container">
    {/* HEADER */}
    <div className="header">
      <div>
        <h1>I Miei Conti</h1>
        <p>Gestisci le tue finanze in un unico posto</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <NewAccountDialog onAddAccount={handleAddAccount} />
      </div>
    </div>

    {/* PATRIMONIO TOTALE */}
    <div className="total-balance-card">
      <div className="label">
        <Wallet size={20} /> Patrimonio Totale
      </div>
      <div className="amount">
        € {totalBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
      </div>
    </div>

    {/* LISTA CONTI */}
    <div className="accounts-grid">
      {accounts.length > 0 ? (
        accounts.map((acc) => (
          <div key={acc.id_conto} className="account-card" onClick={() => navigate(`/conto/${acc.id_conto}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge">{acc.tipo}</span>
              <CreditCard size={20} color="#2563eb" />
            </div>
            <h3>{acc.nome_conto}</h3>
            <div className="balance">
              {acc.valuta} {parseFloat(acc.saldo).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))
      ) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '1rem' }}>
          Nessun conto trovato.
        </div>
      )}
    </div>
  </div>
);}
export default Dashboard;