import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Chat Application API',
        version: '1.0.0',
        description: 'API documentation for Chat Application',
    },
    servers: [
        {
            url: 'http://localhost:8000',
            description: 'Local server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
