import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        trim: true, //all the white space at the beginning are trimmed out
        required: true,
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    secret:{
        type: String,
        required: true,
    },
    about:{
        // for bio
    },
    username:{
        type: String,
        unique: true,
        require: true,
    },
    image: {
        url: String,
        public_id: String
    },
    following:[{type:Schema.ObjectId, ref: 'User'}], // ObjectId should be unique id which we will get when we save anything in mongodb
    followers:[{type:Schema.ObjectId, ref: 'User'}],
}, {timestamps: true});

export default mongoose.model('User', userSchema);