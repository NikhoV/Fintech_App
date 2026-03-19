const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Prendi il token dall'header della richiesta
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Accesso negato. Token mancante." });
    }

    try {
        // 2. Verifica se il token è valido
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified; // Aggiungiamo i dati dell'utente alla richiesta
        next(); // Passa alla funzione successiva (il controller)
    } catch (error) {
        res.status(400).json({ message: "Token non valido" });
    }
};