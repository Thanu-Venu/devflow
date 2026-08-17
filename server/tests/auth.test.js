const request = require("supertest");
const app = require("../src/app");

describe("Auth", () => {
    const user = { name: "Ada Lovelace", email: "ada@example.com", password: "secret123" };

    it("registers a new user and returns a token", async () => {
        const res = await request(app).post("/api/auth/register").send(user);
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe(user.email);
    });

    it("logs in with correct credentials", async () => {
        await request(app).post("/api/auth/register").send(user);
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: user.email, password: user.password });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it("rejects login with the wrong password", async () => {
        await request(app).post("/api/auth/register").send(user);
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: user.email, password: "wrongpass" });
        expect(res.status).toBe(401);
    });
});

describe("Auth guard on protected routes", () => {
    it("rejects GET /api/projects with no token", async () => {
        const res = await request(app).get("/api/projects");
        expect(res.status).toBe(401);
    });

    it("rejects GET /api/projects with a garbage token", async () => {
        const res = await request(app)
            .get("/api/projects")
            .set("Authorization", "Bearer not-a-real-token");
        expect(res.status).toBe(401);
    });

    it("rejects POST /api/tasks with no token", async () => {
        const res = await request(app).post("/api/tasks").send({ title: "x", project: "x" });
        expect(res.status).toBe(401);
    });
});
