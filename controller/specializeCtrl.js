const Specialize = require("../models/specializeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//Create Specialize 
const createSpecialize = asyncHandler(async (req, res) => {
    try {
        const newSpecialize = await Specialize.create(req.body);
        res.json(newSpecialize);

    } catch (error) {
        throw new Error(error);
    }
});

//Update Specialize
const updateSpecialize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedSpecialize = await Specialize.findByIdAndUpdate(id, req.body, { new: true, });
        res.json(updatedSpecialize);

    } catch (error) {
        throw new Error(error);
    }
});

//Delete Specialize
const deleteSpecialize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedSpecialize = await Specialize.findByIdAndDelete(id);
        res.json(deletedSpecialize);

    } catch (error) {
        throw new Error(error);
    }
});

//Get a Specialize
const getSpecialize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaSpecialize = await Specialize.findById(id);
        res.json(getaSpecialize);

    } catch (error) {
        throw new Error(error);
    }
});

//Get all Specialize
const getallSpecialize = asyncHandler(async (req, res) => {

    try {
        const getallSpecialize = await Specialize.find();
        res.json(getallSpecialize);

    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createSpecialize, updateSpecialize, deleteSpecialize, getSpecialize, getallSpecialize };