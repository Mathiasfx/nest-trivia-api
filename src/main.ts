/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { ValidationPipe} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  InternalServerErrorException 
} from '@nestjs/common';

@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    console.error('❌ FULL ERROR DETAILS:');
    console.error('Exception Type:', exception?.constructor?.name);
    console.error('Exception:', exception);
    if (exception instanceof Error) {
      console.error('Stack:', exception.stack);
    }
    
    let status = 500;
    let message = 'Internal server error';
    let errorDetail = '';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      message = typeof resp === 'string' ? resp : (resp as any).message || 'Error';
      errorDetail = JSON.stringify(resp);
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetail = exception.stack || '';
    }
    
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      detail: errorDetail,
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar CORS para permitir Netlify y localhost
  const allowedOrigins = [
    'https://triviamultiplayerdashboard.netlify.app',
    'http://localhost:3000',
    'http://localhost:4200',
    'http://localhost:3007',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4200',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Si no hay origin (por ejemplo, en mobile apps o Postman), permitir
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(null, true); // Permitir igualmente para debugging
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    preflightContinue: true,
    optionsSuccessStatus: 200,
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
  app.useGlobalFilters(new GlobalExceptionFilter());
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
