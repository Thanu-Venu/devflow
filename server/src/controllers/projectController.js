const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await Project.create({
            name,
            description
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Failed to create project" });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch projects" });
    }
};

module.exports = {
    createProject,
    getProjects
};