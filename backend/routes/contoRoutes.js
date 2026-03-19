const express = require('express');
const router = express.Router();
const contoController = require('../controllers/contoController');
const auth = require('../middleware/authMiddleware'); // Importa il filtro

router.get('/total-balance', auth, contoController.getTotalBalance);

router.post('/', auth, contoController.createConto);
router.get('/', auth, contoController.getContiUtente);
router.get('/:id_conto', auth, contoController.getContoById);

module.exports = router;