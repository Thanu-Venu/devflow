const {
    client,
    httpRequestsTotal,
    httpRequestDuration
} = require("./metrics");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const start = process.hrtime();

    res.on("finish", () => {
        const duration = process.hrtime(start);
        const durationSeconds =
            duration[0] + duration[1] / 1e9;

        const route = req.route?.path || req.path;

        httpRequestsTotal.inc({
            method: req.method,
            route,
            status_code: res.statusCode
        });

        httpRequestDuration.observe(
            {
                method: req.method,
                route
            },
            durationSeconds
        );
    });

    next();
});
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);

    res.end(await client.register.metrics());
});
app.get("/", (req, res) => {
    res.json({
        name: "DevFlow API",
        status: "running",
        version: "1.0.0"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "DevFlow API is running"
    });
});

module.exports = app;