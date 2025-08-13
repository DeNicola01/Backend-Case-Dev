import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import customerRoutes from '../interfaces/routes/customerRoutes';
import planningRoutes from '../interfaces/routes/planningRoutes';
import projectionRoutes from '../interfaces/routes/projectionRoutes';
import movementRoutes from '../interfaces/routes/movementRoutes';
import insuranceRoutes from '../interfaces/routes/insuranceRoutes';

export function buildFastify() {
  const fastify = Fastify({ logger: true });

  // CORS manual
  fastify.addHook('onSend', async (request, reply, payload) => {
    reply.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // ajuste conforme seu frontend
    reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return payload;
  });

  // Resposta para requisições OPTIONS (pré-flight)
  fastify.options('/*', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return reply.status(204).send();
  });

  // Configuração Swagger
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Customer & Planning API',
        description: 'API documentation for customer CRUD and planning features',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
  });

  fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  // Registrando rotas
  fastify.register(customerRoutes, { prefix: '/customers' });
  fastify.register(planningRoutes, { prefix: '/plannings' });
  fastify.register(projectionRoutes, { prefix: '/projection' });
  fastify.register(movementRoutes, { prefix: '/movements' });
  fastify.register(insuranceRoutes, { prefix: '/insurances' });

  return fastify;
}

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
