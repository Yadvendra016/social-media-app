import express from 'express';
import {currentUser, login, register} from '../controllers/auth.js'
// middleware
import { requireSignIn } from "../middlewares";

const router = express.Router();

router.post('/register', register);
router.post('/login', login );
router.get('/current-user',requireSignIn, currentUser) // this is to check is user authorised to access the protected page,

module.exports = router; // each file in node.js treated as module