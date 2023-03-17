const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

//Create Blog
const createBlog = asyncHandler(async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);

    }catch(error) {
        throw new Error(error);
    }
});

//Update Blog
const updateBlog = asyncHandler(async(req, res) => {
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updateBlog);

    }catch(error) {
        throw new Error(error);
    }
});

//get a Blog
const getBlog = asyncHandler(async(req, res) => {
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews:1 },//views blog

            },
            {new:true}
        );
        res.json(getBlog);

    }catch(error) {
        throw new Error(error);
    }
});

//get all Blogs
const getAllBlogs = asyncHandler (async (req, res) =>{
    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs);

    }catch(error) {
        throw new Error(error);
    }
});

//Delete Blog
const deleteBlog = asyncHandler(async(req, res) => {
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);

    }catch(error) {
        throw new Error(error);
    }
});

//Like Blog
const liketheBlog=asyncHandler(async(req, res) => {
    const {blogId} =req.body;
    validateMongoDbId(blogId);
    //Find the blog which you want to be Liked
    const blog = await Blog.findById(blogId);
    //Find the login user
    const loginUserId= req?.user?._id;
    //like
    const isLiked=blog?.isLiked;
    //Dislike
    const alreadyDisliked = blog?.isDisLikes?.find(( userId) => userId?.toString() === loginUserId?.toString());
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate( blogId, {
            $pull:{ dislikes : loginUserId },                  //click the dislike button and remove the like
            isDisLiked:false,
        },
        { new:true }
        );
        res.json(blog);
    }
    if(isLiked){
        const blog=await Blog.findByIdAndUpdate(blogId,{
            $pull:{ likes: loginUserId },                    //click the like button and remove the dislike 
            isLiked:false,
        },
        { new:true }
        );
        res.json(blog);

    }
    else{
        const blog=await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},                    //click the like button and remove the dislike 
            isLiked:true,
        },
        { new:true }
        );
        res.json(blog);

    }
});


//DisLike Blog
const disliketheBlog=asyncHandler(async(req, res) => {
    const {blogId} =req.body;
    validateMongoDbId(blogId);
    //Find the blog which you want to be Liked
    const blog = await Blog.findById(blogId);
    //Find the login user
    const loginUserId= req?.user?._id;
    //like
    const isDisLiked=blog?.isDisliked;
    //Dislike
    const alreadyLiked = blog?.likes?.find(( userId) => userId?.toString() === loginUserId?.toString());
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate( blogId, {
            $pull:{ likes : loginUserId },                  //click the dislike button and remove the like
            isLiked:false,
        },
        { new:true }
        );
        res.json(blog);
    }
    if(isDisLiked){
        const blog=await Blog.findByIdAndUpdate(blogId,{
            $pull:{ dislikes: loginUserId },                    //click the like button and remove the dislike 
            isDisliked:false,
        },
        { new:true }
        );
        res.json(blog);

    }
    else{
        const blog=await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUserId},                    //click the like button and remove the dislike 
            isDisliked:true,
        },
        { new:true }
        );
        res.json(blog);

    }
});

//Upload the Blog images
const uploadImages = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
      const uploader = (path) => cloudinaryUploadImg(path,"images");
      const urls = [];
      const files = req.files;
      for(const file of files){
        const {path} = file;
        const newpath = await uploader(path);
        urls.push(newpath);
        fs.unlinkSync(path);
        
      }
      const findBlog =await Blog.findByIdAndUpdate(id,{
        images:urls.map(file => {return file}),
      },
      {
        new:true,
      }
    );
    res.json(findBlog);
  
    }catch(error) {
      throw new Error(error);
    }
  });


module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog, uploadImages};
