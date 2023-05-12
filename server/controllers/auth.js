import User from "../models/user";
import {  comparePassword, hashPassword } from "../helpers/auth";
import jwt from 'jsonwebtoken';
import user from "../models/user";

// for register
export const register = async (req,res) =>{
    const {name, email, password, secret} = req.body;
    // validation
    if(!name) return res.status(400).send('Name is Required');
    if(!password || password.length < 6) return res.status(400).send('Password should be 6 charectors long');
    if(!secret) return res.status(400).send('Answer is Required');
    // check if user already exist
    const exist = await User.findOne({email});
    if(exist) return res.status(400).send("Email already exist"); // send msg if email already exist

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
        if(!match) return res.status(400).send("Incorrect Password");
        
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

// this is to check if the user is authorised enoughf to access the protected page
export const currentUser = async (req,res) =>{
    // console.log(req.auth._id);
    try{
        const user = await User.findById(req.auth._id);
        // res.json(user);
        res.json({ok:true});
    }catch(err){
        console.log("Error in CurrentUser=>",err);
        res.sendStatus(400);
    }

}

// for forgot password
export const forgotPassword = async(req,res) =>{
    console.log(req.body);
    const {email, newPassword, secret} = req.body;
    //validation
    if(!newPassword || !newPassword < 6){
        return res.json({
            error: "new Password is required and should be minimum 6 charector long"
        })
    }
    if(!secret){
        return res.json({
            error: "Secret is required"
        })
    }
    const user = await user.findOne({email,secret});
    if(!user){
        res.json({
            error: "We can't verify you with those details"
        })
    }

    try {
        // remove old password and add new one
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id,{password: hashed});
        return res.json({
            success: "Congrats now you can login with your new Passwrd"
        })
    } catch (error) {
        console.log("Error while forgotPassword =>",error);
        return res.json({
            error:"Sometjing went wrong, Try again"
        })
    }
};