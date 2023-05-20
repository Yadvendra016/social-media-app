import Post from "../models/posts";
import cloudinary from "cloudinary";
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
  // console.log(req.files);
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
    const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);
    //   console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log("ERROR while post-rendring SERVER => ", error);
  }
};
