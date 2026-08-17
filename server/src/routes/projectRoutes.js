const express = require("express");
const { protect } = require("../middleware/auth");
const {
    createProject,
    getProjects
} = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router.get("/", getProjects);
router.post("/", createProject);

module.exports = router;