const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");


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
    try{
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews:1 },

            },
            {new:true}
        );
        res.json(updateViews);

    }catch(error) {
        throw new Error(error);
    }
});


module.exports = {createBlog,updateBlog,getBlog};