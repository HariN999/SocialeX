import Post from '../models/Post.js';

export const createPost = async (req, res) =>{
    try{
        const { fileType, file, description, location, comments } = req.body;
        const newPost = new Post({
            userId: req.user._id,
            userName: req.user.username,
            userPic: req.user.profilePic,
            fileType,
            file,
            description,
            location,
            comments
        });

        const post = await newPost.save();
        res.status(201).json(post);
    }catch(e){
        res.status(500).json({error: e.message || e});
    }
}