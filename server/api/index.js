const express = require('express');
require('reflect-metadata');
const { NestFactory, Reflector } = require('@nestjs/core');
const { ValidationPipe, ClassSerializerInterceptor } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { AppModule } = require('../dist/app.module');
const { HttpExceptionFilter } = require('../dist/common/filters/http-exception.filter');
const { TransformInterceptor } = require('../dist/common/interceptors/transform.interceptor');

const server = express();

let cachedApp = null;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.init();
  cachedApp = app;
  return app;
}

module.exports = async (req, res) => {
  try {
    await bootstrap();
    server(req, res);
  } catch (error) {
    console.error('Bootstrap error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Server initialization failed',
      timestamp: new Date().toISOString(),
    });
  }
};
