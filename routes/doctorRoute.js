const express = require("express");

const { createDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctor, docrating} = require("../controller/doctorCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();



router.post("/", authMiddleware, isAdmin, createDoctor);
router.get("/", authMiddleware, isAdmin, getAllDoctors);
router.put("/rating", authMiddleware, docrating)
router.put("/:id", authMiddleware, isAdmin, updateDoctor);
router.delete("/:id", authMiddleware, isAdmin, deleteDoctor);
router.get("/:id", getDoctor );




module.exports = router;