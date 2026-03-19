import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewMovimentoDialog from '../components/NewMovimentoDialog';
import { useNavigate, useParams } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownLeft, ArrowLeft } from 'lucide-react';

const Conto_Details = () => {
  const [account, setAccount] = useState(null);
  const [movimenti, setMovimenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id_conto } = useParams();

  // Funzione helper per ottenere headers con token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAccount = async (id_conto) => {
    try {
      console.log('📥 Fetching account:', id_conto);
      const response = await axios.get(
        `http://localhost:3000/api/conti/${id_conto}`,
        { headers: getAuthHeaders() }
      );
      setAccount(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ Errore fetchAccount:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const fetchMovimenti = async (id_conto) => {
    try {
      console.log('📥 Fetching movimenti:', id_conto);
      const response = await axios.get(
        `http://localhost:3000/api/movimenti/${id_conto}`,
        { headers: getAuthHeaders() }
      );
      setMovimenti(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ Errore fetchMovimenti:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (id_conto) {
      setLoading(true);
      Promise.all([fetchAccount(id_conto), fetchMovimenti(id_conto)])
        .finally(() => setLoading(false));
    }
  }, [id_conto]);

  const handleAddMovimento = async (newMovimentoData) => {
    try {
      console.log('📤 Inviando movimento:', newMovimentoData);
      
      await axios.post(
        'http://localhost:3000/api/movimenti/',
        newMovimentoData,
        { headers: getAuthHeaders() }
      );

      // Ricarichiamo i movimenti
      await fetchMovimenti(id_conto);
      
      // Se necessario, ricarichiamo anche il saldo del conto
      await fetchAccount(id_conto);
    } catch (err) {
      console.error('❌ Errore nel salvataggio:', err);
      alert('Errore nel salvataggio del movimento: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-8">
          <p className="text-secondary">Caricamento in corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--danger-color)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--danger-color)'
        }}>
          ❌ Errore: {error}
        </div>
      )}

      {account && (
        <>
          {/* Account Header */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <button 
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-icon-only"
                title="Torna indietro"
                style={{
                position: 'absolute',
                left: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                }}
            >
                <ArrowLeft size={18} color="var(--primary)" />
            </button>

            <div className="flex-between">
                <div className="flex gap-3">
                <div className="icon-box icon-box-primary">
                    <Wallet size={24} />
                </div>
                <div>
                    <h1>{account.nome_conto}</h1>
                    <span className="badge badge-primary">{account.tipo}</span>
                </div>
                </div>
                <NewMovimentoDialog 
                id_conto={id_conto}
                onAddMovimento={handleAddMovimento}
                />
            </div>
            </div>

          {/* Balance Card */}
          <div className="card card-gradient mb-6" style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
              Saldo Disponibile
            </p>
            <p style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              {account.valuta} {parseFloat(account.saldo).toLocaleString('it-IT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>

          {/* Movimenti */}
          {/* Movimenti */}
          <div className="card">
            <h2 className="card-title mb-4">Movimenti Recenti</h2>
            
            {movimenti.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-tertiary)'
              }}>
                <p>Nessun movimento registrato</p>
              </div>
            ) : (
              <div className="transaction-list">
                {movimenti.map((movimento) => {
                  const isPositive = movimento.importo > 0;
                  
                  return (
                    <div key={movimento.id_spesa} className="transaction-item">
                      <div className="flex gap-3">
                        <div className={`transaction-icon ${isPositive ? 'income' : 'expense'}`}>
                          {isPositive ? (
                            <ArrowUpRight size={18} />
                          ) : (
                            <ArrowDownLeft size={18} />
                          )}
                        </div>
                        <div className="transaction-details">
                          <p className="transaction-description">
                            {movimento.descrizione}
                          </p>
                          <p className="transaction-date">
                            {movimento.categoria && (
                              <span className="badge badge-primary" style={{ marginRight: '0.5rem', display: 'inline-block' }}>
                                {movimento.categoria}
                              </span>
                            )}
                            {new Date(movimento.data_transazione).toLocaleDateString('it-IT', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <p className={`transaction-amount ${isPositive ? 'income' : 'expense'}`}>
                        {isPositive ? '+' : ''}€{movimento.importo.toLocaleString('it-IT', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Conto_Details;