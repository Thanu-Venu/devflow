const request = require("supertest");
const app = require("../src/app");

describe("Health API", () => {
    test("GET /api/health should return 200", async () => {
        const response = await request(app).get("/api/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("OK");
        expect(response.body.message).toBe("DevFlow API is running");
    });
});