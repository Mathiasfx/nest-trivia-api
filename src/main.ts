/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configura CORS para permitir peticiones desde tu frontend
  const corsOptions = {
    origin: [
      'http://localhost:4200',
      'http://localhost:3007',
      'https://triviamultiplayerdashboard.netlify.app',
      'https://triviamultiplayer.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    maxAge: 86400,
  };
  app.enableCors(corsOptions);

  // Agregar middleware explícito CORS como fallback
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:3007',
      'https://triviamultiplayerdashboard.netlify.app',
      'https://triviamultiplayer.netlify.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Configurar serving de archivos estáticos desde la carpeta public
  const publicPath = join(__dirname, '..', 'public');
  console.log('Public path:', publicPath);
  app.useStaticAssets(publicPath);

  // Agregar middleware para debug
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3007;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📁 Static files served from: http://localhost:${port}/`
  );
  Logger.log(
    `📂 Public directory path: ${publicPath}`
  );
}

bootstrap();
