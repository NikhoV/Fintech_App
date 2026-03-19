const express = require('express');
const router = express.Router();
const movimentoController = require('../controllers/movimentoController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, movimentoController.addMovimento);
router.get('/:id_conto', auth, movimentoController.getMovimentiConto);

module.exports = router;