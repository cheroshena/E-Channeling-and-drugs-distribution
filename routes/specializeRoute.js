const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { updateSpecialize, deleteSpecialize, getSpecialize, getallSpecialize, createSpecialize } = require("../controller/specializeCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createSpecialize);
router.put("/:id", authMiddleware, isAdmin, updateSpecialize);
router.delete("/:id", authMiddleware, isAdmin, deleteSpecialize );
router.get("/:id", getSpecialize );
router.get("/", getallSpecialize );

module.exports= router;