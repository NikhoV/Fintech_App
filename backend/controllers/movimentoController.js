const db = require('../config/db');

exports.addMovimento = async (req, res) => {
    // id_utente viene sempre dal Token!
    const id_utente = req.user.id;
    const { id_conto, importo, categoria, descrizione, data} = req.body;

    try {
        const dataTransazione = data || null;
        // 1. Inseriamo il movimento
        // La data viene inserita automaticamente come CURRENT_TIMESTAMP se non la passiamo
        await db.execute(
            'INSERT INTO spese (id_conto, importo, categoria, descrizione, data_transazione) VALUES (?, ?, ?, ?, IFNULL(?, CURRENT_TIMESTAMP))',
            [id_conto, importo, categoria, descrizione, dataTransazione || null]
        );

        // 2. AGGIORNIAMO IL SALDO DEL CONTO (Logica di business)
        
        await db.execute(
            'UPDATE conto SET saldo = saldo + ? WHERE id_conto = ? AND id_utente = ?',
            [importo, id_conto, id_utente]
        );

        res.status(201).json({ message: "Movimento registrato e saldo aggiornato! 💸" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante la registrazione del movimento" });
    }
};

exports.getMovimentiConto = async (req, res) => {
    const { id_conto } = req.params;
    const id_utente = req.user.id;

    try {
        // Verifichiamo che il conto appartenga effettivamente all'utente (Sicurezza!)
        const [movimenti] = await db.execute(
            'SELECT S.* FROM spese S JOIN conto C ON S.id_conto = C.id_conto WHERE C.id_conto = ? AND C.id_utente = ? ORDER BY S.data_transazione DESC',
            [id_conto, id_utente]
        );
        res.json(movimenti);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nel recupero dei movimenti" });
    }
};