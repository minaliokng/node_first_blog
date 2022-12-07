const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js",
  "./routes/comments.js",
  "./routes/index.js",
  "./routes/like.js",
  "./routes/logNjoin.js",
  "./routes/posts.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);