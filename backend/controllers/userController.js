const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Controlliamo se l'utente esiste già
        const [existingUser] = await db.execute('SELECT * FROM utente WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email già registrata" });
        }

        // 2. Criptiamo la password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Salviamo nel database
        await db.execute(
            'INSERT INTO utente (email, password_hash) VALUES (?, ?)',
            [email, hashedPassword]
        );

        res.status(201).json({ message: "Utente creato con successo! 🎉" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante la registrazione" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cerchiamo l'utente
        const [users] = await db.execute('SELECT * FROM utente WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Credenziali non valide" });
        }

        const user = users[0];

        // 2. Confrontiamo la password inserita con quella nel DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenziali non valide" });
        }

        // 3. Creiamo il braccialetto (Token)
        const token = jwt.sign(
            { id: user.id_utente, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Il braccialetto scade tra un'ora
        );

        res.json({ 
            message: "Login effettuato!", 
            token: token,
            user: { id: user.id_utente, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nel server" });
    }
};