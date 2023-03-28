const express = require("express");
const { createPrescription, updatePrescription, deletePrescription ,uploadImages, getPrescription, getallPrescription} = require("../controller/prescriptionCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { prescImgResize,uploadPhoto } = require("../middlewares/uploadimages");
const router = express.Router();



router.post("/",authMiddleware,createPrescription);

router.put(
    "/upload/:id",
    authMiddleware,
    uploadPhoto.array("images",1),
    prescImgResize,
    uploadImages);

router.put("/:id", authMiddleware,updatePrescription);
router.delete("/:id", authMiddleware ,deletePrescription);

router.get("/:id", getPrescription);
router.get("/", authMiddleware,isAdmin ,getallPrescription);

module.exports = router; 