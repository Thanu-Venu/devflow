const Task = require("../models/Task");
const Project = require("../models/Project");

// Tasks don't carry their own `owner` field - ownership is derived from the
// project they belong to, so every task operation first confirms the
// referenced project belongs to req.user before touching anything.

const createTask = async (req, res) => {
    try {
        const { title, project } = req.body;

        const projectDoc = await Project.findOne({ _id: project, owner: req.user._id });

        if (!projectDoc) {
            return res.status(404).json({ message: "Project not found" });
        }

        const task = await Task.create({ title, project });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
};

const getTasks = async (req, res) => {
    try {
        const ownedProjects = await Project.find({ owner: req.user._id }).select("_id");
        const projectIds = ownedProjects.map((p) => p._id);

        const tasks = await Task.find({ project: { $in: projectIds } })
            .populate("project", "name")
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("project");

        if (!task || String(task.project.owner) !== String(req.user._id)) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Only allow updating fields the client should be able to touch -
        // never trust req.body wholesale (that would let a caller reassign
        // `project` and hop a task into someone else's project).
        const { title, status } = req.body;
        if (title !== undefined) task.title = title;
        if (status !== undefined) task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("project");

        if (!task || String(task.project.owner) !== String(req.user._id)) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
