const swaggerJSdoc = require("swagger-jsdoc");

const config = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "MY API",
      version: "1.0.0",
      description: "this is the api for the developer reference.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },  
      security:[
        {bearerAuth:[]}
      ]
    },
  },
  apis: ["./index.js", "./router/AuthRouter.js","./router/UserRouter.js"],
};
const swagger = swaggerJSdoc(config);

module.exports = { swagger };
