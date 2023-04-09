import User from "../models/user";
import {  comparePassword, hashPassword } from "../helpers/auth";
import jwt from 'jsonwebtoken';

// for register
export const register = async (req,res) =>{
    // console.log("REGISTER ENDPOINT =>",req.body);
    const {name, email, password, secret} = req.body;
    // validation
    if(!name) return res.status(400).send('Name is Required');
    if(!password || password.length < 6) return res.status(400).send('Password is required and should be 6 charectors long');
    if(!secret) return res.status(400).send('Answer is Required');
    // check if user already exist
    const exist = await User.findOne({email});
    if(exist){
        return res.status(400).send("Email already exist");
    }

    // hashed
    const hash = await hashPassword(password);

    const user = new User({name, email, password: hash, secret});
    try {
        await user.save();
        // console.log("REGISTERD USER =>",user);
        return res.json({ok:true});
    } catch (error) {
        console.log("REGISTERED FAILED =>",error);
        return res.status(400).send("Error, Try again");
    }
}

// for login
export const login = async (req,res) =>{
    // console.log(req.body);
    try {
        const {email, password} = req.body;
        //*Check if our database has user with that username
        const user = await User.findOne({email});
        if(!user) return res.status(400).send("user Does not exist");

        //check password
        const match = await comparePassword(password, user.password);
        if(!match) res.status(400).send("Incorrect Password");
        
        // create a jwt token
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET, {expiresIn: "7d"}); // to create sign token

        // we are not saving user password and secret
        user.password = undefined;
        user.secret = undefined;

        res.json({
            token,
            user,
        });

    } catch (err) {
        console.log("ERROR WHILE LOGIN =>",err);
        return res.status(400).send("Error, Try again");
    }
};

