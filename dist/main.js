"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Configura CORS para permitir peticiones desde tu frontend
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:3007'], // Permitir también el mismo puerto
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Configurar serving de archivos estáticos desde la carpeta public
    const publicPath = (0, path_1.join)(__dirname, '..', 'public');
    console.log('Public path:', publicPath);
    app.useStaticAssets(publicPath);
    // Agregar middleware para debug
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = process.env.PORT || 3007;
    await app.listen(port);
    common_2.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    common_2.Logger.log(`📁 Static files served from: http://localhost:${port}/`);
    common_2.Logger.log(`📂 Public directory path: ${publicPath}`);
}
bootstrap();
