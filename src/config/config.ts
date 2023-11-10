require("dotenv").config();

export default {
  PORT: process.env.PORT || 3000,
  JwtToken: process.env.JWT_TOKEN || "Test",
  MongoDBUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/test",
  EndpointVersion1: process.env.ENDPOINT_VERSION_1 || "/ver/v1",
  PostMarkApiKeyL: process.env.POSTMARK_API_KEY || "Test",

  OtpExpLenghInHr: 4,
  isProduction: process.env.NODE_ENV === "production",
};
