const mongoose = require("mongoose");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

let mongod;

beforeAll(async () => {
    // If TEST_MONGO_URI is set (the `mongo` service container in CI, or a
    // local Docker/Atlas instance), connect to it directly. Otherwise spin
    // up an in-memory MongoDB via mongodb-memory-server for zero-setup local
    // testing. If neither is reachable (e.g. a sandboxed/offline machine that
    // can't download the mongod binary), we swallow the error instead of
    // failing the whole file - tests that don't touch the DB (the auth-guard
    // checks) still run and pass; DB-dependent tests will fail on their own
    // query instead, which is a clearer signal than an opaque setup crash.
    try {
        if (process.env.TEST_MONGO_URI) {
            await mongoose.connect(process.env.TEST_MONGO_URI);
        } else {
            const { MongoMemoryServer } = require("mongodb-memory-server");
            mongod = await MongoMemoryServer.create();
            await mongoose.connect(mongod.getUri());
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[tests/setup] Could not start a MongoDB instance (${err.message}). DB-dependent tests will fail; DB-free tests are unaffected.`);
    }
});

afterEach(async () => {
    if (mongoose.connection.readyState !== 1) return;
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongod) await mongod.stop();
});
