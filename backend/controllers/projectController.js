const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can submit projects",
      });
    }

    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      academicYear,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const project = await Project.create({
      owner: req.user._id,
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      githubUrl,
      liveUrl,
      academicYear,
    });

    res.status(201).json({
      message: "Project submitted successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate(
        "owner",
        "name email programme enrollmentNumber"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getAllProjects,
};
