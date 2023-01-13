import mongoose from "mongoose";

beforeAll(() => {
  // jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(async () => {
  await mongoose.connection.close();
});
