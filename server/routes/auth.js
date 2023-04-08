import express from 'express';
import {register} from '../controllers/auth.js'

const router = express.Router();

router.post('/register', register);

module.exports = router; // each module in node.js treated as module