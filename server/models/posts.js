import mongoose from 'mongoose';

const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    content: {
        // I use type because rich text editor can sent any type of data
        type:{},
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    image: {
        url: String,
        public_id: String
    },
    like: [{type: ObjectId, ref: "User"}],
    comment: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            postedBy:{
                type: ObjectId,
                ref: "User"
            }
        }
    ]
}, {timestamps: true});

export default mongoose.model("Post", postSchema);