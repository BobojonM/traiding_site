// Import dependencies
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API for Yerlan.space',
      version: '1.0.0',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      contact: {
        name: 'API Support',
        url: 'https://yerlan.space',
        email: 'support@yerlan.space',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://yerlan.space:5000',
        description: 'Production server',
      },
    ],
  },
  apis: ['./routes/*.js', './router/index.mjs'], // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;