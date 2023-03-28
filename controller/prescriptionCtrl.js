const Prescription = require("../models/prescriptionModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");


//Create Prescription
const createPrescription = asyncHandler(async(req, res) => {
    try{
        const newPresc = await Prescription.create(req.body);
        res.json(newPresc);

    }catch(error) {
        throw new Error(error);
    }
});

//Update Prescription
const updatePrescription = asyncHandler(async(req, res) => {
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updatePrescription = await Prescription.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatePrescription);

    }catch(error) {
        throw new Error(error);
    }
});


//Delete Prescription
const deletePrescription = asyncHandler(async(req, res) => {
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const deletedPrescription = await Prescription.findByIdAndDelete(id);
        res.json(deletedPrescription);

    }catch(error) {
        throw new Error(error);
    }
});

//Upload the Prescription images
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
      const findPrescription =await Prescription.findByIdAndUpdate(id,{
        images:urls.map(file => {return file}),
      },
      {
        new:true,
      }
    );
    res.json(findPrescription);
  
    }catch(error) {
      throw new Error(error);
    }
  });

  //Get a Prescription
const getPrescription = asyncHandler( async ( req,res ) => {
  const {id} = req.params;
  validateMongoDbId(id);
  try{
      const getaPrescription = await Prescription.findById(id);
      res.json ( getaPrescription );

  }catch ( error ) {
      throw new Error ( error );
  }
});

//Get all Brand
const getallPrescription = asyncHandler( async ( req,res ) => {
    
  try{
      const getallPrescriptions = await Prescription.find();
      res.json ( getallPrescriptions );

  }catch ( error ) {
      throw new Error ( error );
  }
});



module.exports = { createPrescription , updatePrescription , deletePrescription , uploadImages, getPrescription, getallPrescription};