import express from 'express';
import {login, register} from '../controllers/auth.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login );

module.exports = router; // each module in node.js treated as module