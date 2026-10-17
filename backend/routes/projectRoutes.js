const express = require("express");
const {
  createProject,
  getMyProjects,
  getAllProjects,
} = require("../controllers/projectController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/my", protect, getMyProjects);
router.get("/admin/all", protect, adminOnly, getAllProjects);

module.exports = router;
