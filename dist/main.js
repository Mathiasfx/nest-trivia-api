"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const common_3 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
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
        if (exception instanceof common_3.HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();
            message = typeof resp === 'string' ? resp : resp.message || 'Error';
            errorDetail = JSON.stringify(resp);
        }
        else if (exception instanceof Error) {
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
};
GlobalExceptionFilter = __decorate([
    (0, common_3.Catch)()
], GlobalExceptionFilter);
async function bootstrap() {
    try {
        console.log('🔥🔥🔥 BOOTSTRAP STARTING - VERSION 2.0.5 🔥🔥🔥');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ CORS INITIALIZED - Version 2.0.5 (PERMISSIVE)');
        // Configurar CORS de forma ultra permisiva para debugging
        app.enableCors({
            origin: true, // Permite cualquier origen
            credentials: true,
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
            allowedHeaders: '*',
            exposedHeaders: '*',
            maxAge: 86400,
            optionsSuccessStatus: 200,
            preflightContinue: false,
        });
        // Configurar serving de archivos estáticos desde la carpeta public
        const publicPath = (0, path_1.join)(__dirname, '..', 'public');
        console.log('Public path:', publicPath);
        app.useStaticAssets(publicPath);
        // Agregar middleware para debug
        app.use((req, res, next) => {
            next();
        });
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.useGlobalFilters(new GlobalExceptionFilter());
        const port = process.env.PORT || 3007;
        await app.listen(port);
        common_2.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
        common_2.Logger.log(`📁 Static files served from: http://localhost:${port}/`);
        common_2.Logger.log(`📂 Public directory path: ${publicPath}`);
    }
    catch (error) {
        console.error('❌ FATAL ERROR DURING BOOTSTRAP:', error);
        process.exit(1);
    }
}
bootstrap();
bootstrap();
