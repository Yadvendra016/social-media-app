import User from "../models/user";
import { comparePassword, hashPassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import user from "../models/user";
import { nanoid } from "nanoid"; // it used to generate userId

// for register
export const register = async (req, res) => {
  const { name, email, password, secret } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is Required");
  if (!password || password.length < 6)
    return res.status(400).send("Password should be 6 charectors long");
  if (!secret) return res.status(400).send("Answer is Required");
  // check if user already exist
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).send("Email already exist"); // send msg if email already exist

  // hashed
  const hash = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hash,
    secret,
    username: nanoid(6),
  });
  try {
    await user.save();
    // console.log("REGISTERD USER =>",user);
    return res.json({ ok: true });
  } catch (error) {
    console.log("REGISTERED FAILED =>", error);
    return res.status(400).send("Error, Try again");
  }
};

// for login
export const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    //*Check if our database has user with that username
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("user Does not exist");

    //check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Incorrect Password");

    // create a jwt token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // to create sign token

    // we are not saving user password and secret
    user.password = undefined;
    user.secret = undefined;

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log("ERROR WHILE LOGIN =>", err);
    return res.status(400).send("Error, Try again");
  }
};

// this is to check if the user is authorised enoughf to access the protected page
export const currentUser = async (req, res) => {
  // console.log(req.auth._id);
  try {
    const user = await User.findById(req.auth._id);
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log("Error in CurrentUser=>", err);
    res.sendStatus(400);
  }
};

// for forgot password
export const forgotPassword = async (req, res) => {
  console.log(req.body);
  const { email, newPassword, secret } = req.body;
  //validation
  if (!newPassword || !newPassword < 6) {
    return res.json({
      error: "new Password is required and should be minimum 6 charector long",
    });
  }
  if (!secret) {
    return res.json({
      error: "Secret is required",
    });
  }
  const user = await user.findOne({ email, secret });
  if (!user) {
    res.json({
      error: "We can't verify you with those details",
    });
  }

  try {
    // remove old password and add new one
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "Congrats now you can login with your new Passwrd",
    });
  } catch (error) {
    console.log("Error while forgotPassword =>", error);
    return res.json({
      error: "Sometjing went wrong, Try again",
    });
  }
};

// for profile update
export const profileUpdate = async (req, res) => {
  try {
    // console.log(req.body);
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.about) {
      data.about = req.body.about;
    }
    if (req.body.password) {
      if (req.body.password < 6) {
        return res.json({
          error: "Password is required and should be min 6 charector long",
        });
      } else {
        data.password = req.body.password;
      }
    }
    if (req.body.secret) {
      data.secret = req.body.secret;
    }
    if (req.body.image) {
      data.image = req.body.image;
    }

    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    user.password = undefined;
    user.secret = undefined;

    res.json(user);
  } catch (error) {
    if (error.code == 1100) {
      return res.json({ error: "Duplicate Username" });
    }
    console.log("Error while profile updating server =>", error);
  }
};

// for finding people to follow - get all user
export const findPeople = async (req, res) => {
  // get all the user except logedin user and user which already followed
  try {
    const user = await User.findById(req.auth._id);
    //user.following
    let following = user.following; // following has arrays of user id
    following.push(user._id);

    //find the people (except user in the following array)
    const people = await User.find({ _id: { $nin: following } })
      .select("-password -secret")
      .limit(10);
    res.json(people);
  } catch (error) {
    console.log("Error in findPeople server =>", error);
  }
};

// middeware => when click on follow my id add on that user followers array
export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log("Error whiel addFollower middleware controler =>", error);
  }
};

//Follow people -> that user _id add in my following array
export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (error) {
    console.log("Error userFollow controller => ", error);
  }
};

//Following page show the all follwoing user
export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
  } catch (error) {
    console.log("error from controller userFollowing", error);
  }
};

//meddleware
export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log("removeFollower =>", error);
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log("userUnfollow =>", error);
  }
};
