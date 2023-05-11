import {expressjwt} from "express-jwt" // to verify token


// this verify token if not verify it throw error other wise we are able to access the user id
export const requireSignIn = expressjwt({ 
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});