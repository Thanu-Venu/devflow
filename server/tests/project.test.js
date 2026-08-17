const request = require("supertest");
const app = require("../src/app");

async function registerUser(overrides = {}) {
    const user = {
        name: "Grace Hopper",
        email: "grace@example.com",
        password: "secret123",
        ...overrides
    };
    const res = await request(app).post("/api/auth/register").send(user);
    return res.body.token;
}

describe("Project ownership", () => {
    it("creates a project scoped to the authenticated user", async () => {
        const token = await registerUser();
        const res = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Launch Plan", description: "Q1" });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Launch Plan");
        expect(res.body.owner).toBeDefined();
    });

    it("only returns projects owned by the requesting user", async () => {
        const tokenA = await registerUser({ email: "userA@example.com" });
        const tokenB = await registerUser({ email: "userB@example.com" });

        await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ name: "User A Project" });

        const resB = await request(app)
            .get("/api/projects")
            .set("Authorization", `Bearer ${tokenB}`);

        expect(resB.status).toBe(200);
        expect(resB.body).toHaveLength(0);

        const resA = await request(app)
            .get("/api/projects")
            .set("Authorization", `Bearer ${tokenA}`);

        expect(resA.body).toHaveLength(1);
    });

    it("prevents creating a task under another user's project", async () => {
        const tokenA = await registerUser({ email: "userA2@example.com" });
        const tokenB = await registerUser({ email: "userB2@example.com" });

        const projectRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ name: "Private Project" });

        const taskRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${tokenB}`)
            .send({ title: "Sneaky task", project: projectRes.body._id });

        expect(taskRes.status).toBe(404);
    });

    it("prevents deleting a task that belongs to another user's project", async () => {
        const tokenA = await registerUser({ email: "userA3@example.com" });
        const tokenB = await registerUser({ email: "userB3@example.com" });

        const projectRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ name: "Another Private Project" });

        const taskRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ title: "Real task", project: projectRes.body._id });

        const deleteRes = await request(app)
            .delete(`/api/tasks/${taskRes.body._id}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(deleteRes.status).toBe(404);
    });
});
