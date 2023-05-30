import express from "express";
import {
  currentUser,
  forgotPassword,
  login,
  register,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  removeFollower,
  userUnfollow,
} from "../controllers/auth.js";
// middleware
import { requireSignIn } from "../middlewares";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignIn, currentUser); // this is to check is user authorised to access the protected page,
router.post("/forgot-password", forgotPassword);

//to update user
router.put("/profile-update", requireSignIn, profileUpdate);
router.get("/find-people", requireSignIn, findPeople); // for find people to follow
// to follow
router.put("/user-follow", requireSignIn, addFollower, userFollow); //(addFollower is middleware but still it is in the controller)
//following page
router.get("/user-following", requireSignIn, userFollowing);
//unfollow
router.put("/user-unfollow",requireSignIn,removeFollower, userUnfollow);

module.exports = router; // each file in node.js treated as module
