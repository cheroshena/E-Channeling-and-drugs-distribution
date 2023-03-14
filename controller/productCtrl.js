const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const e = require("express");


//create Product
const createProduct = asyncHandler(async(req,res)=>{

    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    }catch(error) {
        throw new Error(error);
    }
    
});

//Update Product
const updateProduct = asyncHandler(async (req, res) =>{
    const { id } = req.params; // Update to get the actual ID value from the URL
    try {
      const product = await Product.findById(id); // Find the product by ID
  
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }
  
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true } // Set the `new` option to `true` to return the updated product
      );
  
      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  
//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Update to get the actual ID value from the URL
    try {
      const product = await Product.findById(id); // Find the product by ID
  
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }
  
      const deletedProduct = await Product.findByIdAndDelete(id); // Delete the product by ID
  
      res.json(deletedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  

//get a one product
const getaProduct = asyncHandler(async (req,res) => {
    const { id } = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);

    }catch(error){
        throw new Error(error);
    }
});

//get all product
const getAllProduct = asyncHandler(async (req, res) => {
  try {

    //Filtering 
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    console.log('queryObj:', queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log('queryStr:', queryStr);

    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(",").join ("");
      query=query.sort(sortBy);

    }else{
      query = query.sort("-createdAt");

    }
    
    //Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination(How many products show in one page...)
    const page=req.query.page;
    const limit=req.query.limit;
    const skip=(page -1)* limit;
    query=query.skip(skip).limit(limit);
    if(req.query.page){
      const productCount=await Product.countDocuments();
      if(skip>=productCount) throw new Error("This page does not exists");
    }
    console.log(page, limit, skip);


    const products = await query;
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});




module.exports = {createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct};