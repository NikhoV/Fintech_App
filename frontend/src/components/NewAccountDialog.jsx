import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const NewAccountDialog = ({ onAddAccount }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome_conto: '',
    tipo: 'corrente',
    saldo: '0',
    valuta: '€',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome_conto.trim()) {
      alert('Inserisci un nome per il conto');
      return;
    }

    // Qui inviamo i dati alla funzione che passeremo dalla Dashboard
    onAddAccount({
      ...formData,
      saldo: parseFloat(formData.saldo) || 0,
    });

    // Reset e chiusura
    setFormData({ nome_conto: '', tipo: 'corrente', saldo: '0', valuta: '€' });
    setOpen(false);
  };

  return (
    <>
      {/* Bottone per aprire il Modal (stile Fintech) */}
      <button onClick={() => setOpen(true)} className="add-account-btn">
        <Plus size={20} />
        Nuovo Conto
      </button>

      {/* Background scuro quando aperto */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Crea Nuovo Conto</h3>
              <button onClick={() => setOpen(false)} className="close-x"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome del conto</label>
                <input
                  type="text"
                  placeholder="es. Risparmi Casa"
                  value={formData.nome_conto}
                  onChange={(e) => setFormData({...formData, nome_conto: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Tipo di conto</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="corrente">Conto Corrente</option>
                  <option value="risparmio">Conto Risparmio</option>
                  <option value="investimento">Investimenti</option>
                  <option value="portafoglio">Portafoglio</option>
                </select>
              </div>

              <div className="form-group">
                <label>Saldo iniziale</label>
                <div className="balance-input-group">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.saldo}
                    onChange={(e) => setFormData({...formData, saldo: e.target.value})}
                  />
                  <span className="currency-tag">{formData.valuta}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Annulla</button>
                <button type="submit" className="btn-primary">Crea Conto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewAccountDialog;