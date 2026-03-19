const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Quando arriva una chiamata POST a /register, esegui la funzione registerUser
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;