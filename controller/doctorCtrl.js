const mongoose = require('mongoose');
const Doctor = require("../models/doctorModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");
const cloudinaryUploadImg = require("../utils/cloudinary");
const User = require("../models/userModel");
const fs = require("fs");


//Create Doctor
const createDoctor = asyncHandler(async(req, res) => {
    try{
        const newDoctor = await Doctor.create(req.body);
        res.json(newDoctor);

    }catch(error) {
        throw new Error(error);
    }
});

//get all Doctor
const getAllDoctors = asyncHandler (async (req, res) =>{
    try{
        const alldoctors = await Doctor.find();
        res.json(alldoctors);

    }catch(error) {
        throw new Error(error);
    }
});

//Update Doctor
const updateDoctor = asyncHandler( async ( req,res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedoctor = await Doctor.findByIdAndUpdate(id,req.body,{new:true,});
        res.json ( updatedoctor );

    }catch ( error ) {
        throw new Error ( error );
    }
});

//Delete Doctor
const deleteDoctor = asyncHandler(async(req, res) => {
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const deleteddoc = await Doctor.findByIdAndDelete(id);
        res.json(deleteddoc);

    }catch(error) {
        throw new Error(error);
    }
});

//Get a Doctor
const getDoctor = asyncHandler( async ( req,res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getaDoctor = await Doctor.findById(id);
        res.json ( getaDoctor );

    }catch ( error ) {
        throw new Error ( error );
    }
});

//doctor rating
const docrating = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {star, docId, comment} = req.body;
  
    try {
      const doctor = await Doctor.findById(docId);
      let alreadyRated = doctor.docratings.find((userId) => userId.postedby.toString() === _id.toString());
  
      if (alreadyRated) {
        const updateRating = await Doctor.updateOne(
          {
            docratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "docratings.$.star": star, "docratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
      } else {
        const rateDoctor = await Doctor.findByIdAndUpdate(
          docId,
          {
            $push: {
              docratings: {
                star: star,
                comment: comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
      }
  
      const getallratings = await Doctor.findById(docId);
      let totalRating = getallratings.docratings.length;
      let ratingsum = getallratings.docratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round(ratingsum / totalRating);
  
      let finalDoctor = await Doctor.findByIdAndUpdate(docId, {
        doctotalrating: actualRating,
      }, 
      { new: true }
      );
  
      res.json(finalDoctor);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //upload doctor img
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
      const findDoctor =await Doctor.findByIdAndUpdate(id,{
        images:urls.map(file => {return file}),
      },
      {
        new:true,
      }
    );
    res.json(findDoctor);
  
    }catch(error) {
      throw new Error(error);
    }
  });



module.exports = { createDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctor, docrating, uploadImages};