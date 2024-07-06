const app = require("./src/app");
const http = require("http");
const { connectDb, closeDb } = require("./src/utils/db.utils");

let server;

beforeAll(async () => {
  try {
    const db = await connectDb();
    if (!db.status) {
      throw new Error(db.message);
    }
    server = http.createServer(app);
  } catch (error) {
    console.error(error);
  }
});

afterAll(() => {
  return new Promise((resolve, reject) => {
    closeDb()
      .then(() => {
        server.close(resolve);
      })
      .catch(reject);
  });
});
