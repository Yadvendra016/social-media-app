import User from "../models/user";
import {  comparePassword, hashPassword } from "../helpers/auth";

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
        console.log("REGISTERD USER =>",user);
        return res.json({ok:true});
    } catch (error) {
        console.log("REGISTERED FAILED =>",error);
        return res.status(400).send("Error, Try again");
    }
}