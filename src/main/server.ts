import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import customerRoutes from '../interfaces/routes/customerRoutes';
import planningRoutes from '../interfaces/routes/planningRoutes'; // ⬅ import do Planning
import projectionRoutes from '../interfaces/routes/projectionRoutes';
import movementRoutes from '../interfaces/routes/movementRoutes';
import insuranceRoutes from '../interfaces/routes/insuranceRoutes';

export function buildFastify() {
  const fastify = Fastify({ logger: true });

  // Configuração do Swagger
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Customer & Planning API',
        description: 'API documentation for customer CRUD and planning features',
        version: '1.0.0'
      },
      servers: [{ url: 'http://localhost:3000' }],
    }
  });

  fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
  });

  // Rotas
  fastify.register(customerRoutes, { prefix: '/customers' });
  fastify.register(planningRoutes, { prefix: '/plannings' }); // ⬅ registra rotas de Planning
  fastify.register(projectionRoutes, { prefix: '/projection' });
  fastify.register(movementRoutes, { prefix: '/movements' });
  fastify.register(insuranceRoutes, { prefix: '/insurances' });

  return fastify;
}

// Apenas starta o servidor se o arquivo for executado diretamente
if (require.main === module) {
  const fastify = buildFastify();
  const start = async () => {
    try {
      await fastify.listen({ port: 3000, host: '0.0.0.0' });
      console.log('Server running at http://localhost:3000');
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  start();
}
