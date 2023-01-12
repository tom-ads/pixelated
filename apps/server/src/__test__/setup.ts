import mongoose from "mongoose";

beforeAll(() => {
  // jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});
