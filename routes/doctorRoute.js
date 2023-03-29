const express = require("express");

const { createDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctor, docrating,uploadDocImages, deleteImages} = require("../controller/doctorCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { doctorImgResize, uploadPhoto } = require("../middlewares/uploadimages");
const router = express.Router();



router.post("/", authMiddleware, isAdmin, createDoctor);
router.get("/", getAllDoctors);
router.put(
    "/upload/",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images",2),
    doctorImgResize,
    uploadDocImages);

router.put("/rating", authMiddleware, docrating)
router.put("/:id", authMiddleware, isAdmin, updateDoctor);
router.delete("/:id", authMiddleware, isAdmin, deleteDoctor);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

router.get("/:id", getDoctor );




module.exports = router;