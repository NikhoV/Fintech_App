const db = require('../config/db');

exports.createConto = async (req, res) => {
    
    // Nota: L'id_utente lo prenderemo dal Token (per ora lo passiamo nel body per testare)
    const { nome_conto, saldo, valuta, tipo } = req.body;
    const id_utente = req.user.id;

    try {
        const [result] = await db.execute(
            'INSERT INTO conto (id_utente, nome_conto, saldo, valuta, tipo) VALUES (?, ?, ?, ?, ?)',
            [id_utente, nome_conto, saldo || 0, valuta || 'EUR', tipo || 'corrente']
        );

        res.status(201).json({ 
            message: "Conto creato!", 
            id_conto: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nella creazione del conto" });
    }
};

exports.getContiUtente = async (req, res) => {
    const id_utente = req.user.id;

    try {
        const [conti] = await db.execute('SELECT * FROM conto WHERE id_utente = ?', [id_utente]);
        res.json(conti);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nel recupero dei conti" });
    }
};

exports.getTotalBalance = async (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT SUM(saldo) AS totalBalance FROM conto WHERE id_utente = ?';

    try {
        const [rows] = await db.execute(query, [userId]);
        const total = rows[0].totalBalance || 0;
        res.json({ totalBalance: parseFloat(total) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore nel calcolo del saldo totale" });
    }
};

exports.getContoById = async (req, res) => {
    const id_conto = req.params.id_conto;
    const id_utente = req.user.id;

    try {
        const [conti] = await db.execute('SELECT * FROM conto WHERE id_conto = ? AND id_utente = ?', [id_conto, id_utente]);
        if (conti.length === 0) {
            return res.status(404).json({ message: "Conto non trovato" });
        }
        res.json(conti[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nel recupero del conto" });
    }
};