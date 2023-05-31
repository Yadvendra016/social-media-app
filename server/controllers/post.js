import Post from "../models/posts";
import cloudinary from "cloudinary";
import User from "../models/user";

//config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const createPost = async (req, res) => {
  // console.log("Post=>", req.body);
  const { content, image } = req.body;
  if (!content.length) {
    return res.json({
      error: "content is required",
    });
  }

  try {
    const post = new Post({ content, image, postedBy: req.auth._id });
    post.save();
    res.json(post);
  } catch (error) {
    console.log("Error while creating post server => ", error);
    res.sendStatus(400);
  }
};

export const uploadImage = async (req, res) => {
  // console.log(req.files.image.path);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log(result);
    res.json({
      url: result.secure_url, // https url
      public_id: result.public_id,
    });
  } catch (error) {
    console.log("ERROR WHILE UPLOAD IMAGE SERVER => ", error);
  }
};

// post-rendring
export const postByUser = async (req, res) => {
  try {
    // const posts = await Post.find({ postedBy: req.auth._id })

    //*** this it to render all post but we want only followed user post */

    /*const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);
    //   console.log(posts);
    res.json(posts); */

    const user = await User.findById(req.auth._id);
    let following = user.following;

    // follwoing array contains all the following users Id(whch we did on auth.js- userFollowing) and also we put our id so that our post is also visible
    following.push(req.auth._id);

    const posts = await Post.find({ postedBy: { $in: following } })
    .populate("postedBy", "_id name image")
    .sort({ createdAt: -1 })
    .limit(10);

      res.json(posts);
  } catch (error) {
    console.log("ERROR while post-rendring SERVER => ", error);
  }
};

//post-edit
export const userPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    res.json(post);
  } catch (error) {
    console.log("Error while UserPost edit server =>", error);
  }
};

//update post
export const updatePost = async (req, res) => {
  // console.log("Post update", req.body);
  try {
    const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    res.json(post);
  } catch (error) {
    console.log("Error while update post server =>", error);
  }
};

//delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    // remove the image from cloudinary
    if (post.image && post.image.public_id) {
      const image = await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.json({ ok: true });
  } catch (error) {
    console.log("Error while Detlet post server =>", error);
  }
};

//like post
export const likePost = async (req,res) =>{
  try {

    const post = await Post.findByIdAndUpdate(req.body._id, {
      $addToSet: {like: req.auth._id}
    },{new: true});

    res.json(post);

  } catch (error) {
    console.log("likepost => ",error);
  }
}

//unlike post
export const unlikePost = async (req,res) =>{
  try {

    const post = await Post.findByIdAndUpdate(req.body._id, {
      $pull: {like: req.auth._id}
    },{new: true});

    res.json(post);
    
  } catch (error) {
    console.log("unlikePost",error);
  }
}