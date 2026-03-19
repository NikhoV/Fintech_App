const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Il ponte che abbiamo appena testato
const userRoutes = require('./routes/userRoutes');
const contoRoutes = require('./routes/contoRoutes');
const movimentoRoutes = require('./routes/movimentoRoutes');

const app = express();

// Middleware
app.use(cors()); // Permette al frontend di comunicare col backend
app.use(express.json()); // Permette al server di leggere i dati in formato JSON

app.use('/api/users', userRoutes); // Utilizziamo le rotte degli utenti
app.use('/api/conti', contoRoutes);
app.use('/api/movimenti', movimentoRoutes);

// Rotta di test (giusto per vedere se il server risponde)
app.get('/', (req, res) => {
    res.send('Il server della Fintech App è attivo e funzionante!');
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});