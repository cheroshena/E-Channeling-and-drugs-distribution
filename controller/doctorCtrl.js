const Doctor = require("../models/doctorModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");


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


module.exports = { createDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctor};