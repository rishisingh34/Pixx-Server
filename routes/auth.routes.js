const router = require('express').Router();
const { register , login, verify, emailVerified  } = require('../controllers/auth.controller');

router.post('/register', register );
router.post('/login', login);
router.get('/verifyEmail', verify); 
router.get('/emailVerified', emailVerified);

module.exports = router; 