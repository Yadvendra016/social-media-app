import Post from '../models/posts';
import cloudinary from 'cloudinary'
//config cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

export const createPost = async (req,res) =>{
    // console.log("Post=>", req.body);
    const {content, image} = req.body;
    if(!content.length){
        return res.json({
            error: "content is required",
        });
    }

    try {
       const post = new Post({content, image, postedBy: req.auth._id});
       post.save();
       res.json(post);

        
    } catch (error) {
        console.log("Error while creating post server => ",error);
        res.sendStatus(400);
    }
}

export const uploadImage = async (req,res) =>{
    // console.log(req.files);
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path);
        console.log(result);
        res.json({
            url: result.secure.url, // https url
            public_id: result.public_id
        })
    } catch (error) {
        console.log("ERROR WHILE UPLOAD IMAGE SERVER => ",error);
    }
}