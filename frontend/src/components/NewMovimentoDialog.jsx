import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const NewMovimentoDialog = ({ id_conto, onAddMovimento }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_conto: id_conto || '',
    importo: '',
    categoria: '',
    descrizione: '',
    data_transazione: new Date().toISOString().split('T')[0], // Data di oggi per default
    creato_da_ricorrenza: '0',
  });

  const [errors, setErrors] = useState({});

  // Categorie comuni per le spese
  const categorie = [
    'Cibo',
    'Trasporto',
    'Intrattenimento',
    'Utilities',
    'Salute',
    'Shopping',
    'Prestito',
    'Veicolo',
    'Altro'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.importo || parseFloat(formData.importo) === 0) {
      newErrors.importo = 'Inserisci un importo valido';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Seleziona una categoria';
    }

    if (!formData.descrizione.trim()) {
      newErrors.descrizione = 'Aggiungi una descrizione';
    }

    if (!formData.data_transazione) {
      newErrors.data_transazione = 'Seleziona una data';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Invia i dati al parent
    onAddMovimento({
      ...formData,
      importo: parseFloat(formData.importo),
      creato_da_ricorrenza: parseInt(formData.creato_da_ricorrenza),
    });

    // Reset e chiusura
    setFormData({
      id_conto: id_conto || '',
      importo: '',
      categoria: '',
      descrizione: '',
      data_transazione: new Date().toISOString().split('T')[0],
      creato_da_ricorrenza: '0',
    });
    setErrors({});
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Rimuovi l'errore quando l'utente inizia a digitare
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <>
      {/* Bottone per aprire il Modal */}
      <button onClick={() => setOpen(true)} className="btn btn-primary btn-fit">
        <Plus size={18} />
        Nuovo Movimento
      </button>

      {/* Background scuro quando aperto */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Aggiungi Movimento</h3>
              <button 
                onClick={() => setOpen(false)} 
                className="close-x"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form" style={{ color: 'black' }}>
              {/* Importo */}
              <div className="form-group">
                <label htmlFor="importo">
                  Importo * <small style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
                    (positivo: entrata, negativo: uscita)
                  </small>
                </label>
                <div className="input-with-currency">
                  <input
                    id="importo"
                    type="number"
                    name="importo"
                    step="0.01"
                    placeholder="es. 50.00 o -30.00"
                    value={formData.importo}
                    onChange={handleInputChange}
                    className={errors.importo ? 'error' : ''}
                  />
                  <span className="currency-symbol">€</span>
                </div>
                {errors.importo && <span className="error-message">{errors.importo}</span>}
              </div>

              {/* Categoria */}
              <div className="form-group">
                <label htmlFor="categoria">Categoria *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={errors.categoria ? 'error' : ''}
                >
                  <option value="">Seleziona una categoria</option>
                  {categorie.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.categoria && <span className="error-message">{errors.categoria}</span>}
              </div>

              {/* Descrizione */}
              <div className="form-group">
                <label htmlFor="descrizione">Descrizione *</label>
                <input
                  id="descrizione"
                  type="text"
                  name="descrizione"
                  placeholder="es. Pizza con amici, Benzina, Stipendio"
                  value={formData.descrizione}
                  onChange={handleInputChange}
                  className={errors.descrizione ? 'error' : ''}
                />
                {errors.descrizione && <span className="error-message">{errors.descrizione}</span>}
              </div>

              {/* Data Transazione */}
              <div className="form-group">
                <label htmlFor="data_transazione">Data Transazione *</label>
                <input
                  id="data_transazione"
                  type="date"
                  name="data_transazione"
                  value={formData.data_transazione}
                  onChange={handleInputChange}
                  className={errors.data_transazione ? 'error' : ''}
                />
                {errors.data_transazione && <span className="error-message">{errors.data_transazione}</span>}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-secondary"
                >
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Aggiungi Movimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewMovimentoDialog;