const express = require("express");
const router = express.Router();
const { createDoctor, getAllDoctors, updateDoctor, deleteDoctor, getDoctor} = require("../controller/doctorCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");




router.post("/", authMiddleware, isAdmin, createDoctor);
router.get("/", authMiddleware, isAdmin, getAllDoctors);

router.put("/:id", authMiddleware, isAdmin, updateDoctor);
router.delete("/:id", authMiddleware, isAdmin, deleteDoctor);
router.get("/:id", getDoctor );



module.exports = router;