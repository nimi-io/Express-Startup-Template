require("dotenv").config();

export default {
  PORT: process.env.PORT || 3000,
  JwtToken: process.env.JWT_TOKEN || "Test",
  MongoDBUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/test",
};
