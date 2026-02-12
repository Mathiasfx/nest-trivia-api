"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriviaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TriviaService = class TriviaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTrivia(userId, createTriviaDto) {
        // Verificar si el usuario ya tiene una trivia activa
        const existingActiveTrivia = await this.prisma.trivia.findFirst({
            where: {
                userId,
                isActive: true,
            },
        });
        if (existingActiveTrivia) {
            throw new common_1.ForbiddenException('Ya tienes una trivia activa. Debes finalizarla antes de crear una nueva.');
        }
        // Verificar límite de preguntas (máximo 10)
        if (createTriviaDto.questions.length > 10) {
            throw new common_1.ForbiddenException('No puedes tener más de 10 preguntas por trivia.');
        }
        // Validar cada pregunta (2-4 opciones)
        for (const question of createTriviaDto.questions) {
            if (question.options.length < 2 || question.options.length > 4) {
                throw new common_1.ForbiddenException('Cada pregunta debe tener entre 2 y 4 opciones.');
            }
            if (!question.options.includes(question.answer)) {
                throw new common_1.ForbiddenException('La respuesta correcta debe estar entre las opciones.');
            }
        }
        return this.prisma.trivia.create({
            data: {
                userId,
                title: createTriviaDto.title,
                questions: createTriviaDto.questions,
                isActive: false, // No activar automáticamente al crear
            },
        });
    }
    async getMyTrivia(userId) {
        return this.prisma.trivia.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getTriviaById(id, userId) {
        const trivia = await this.prisma.trivia.findUnique({
            where: { id },
        });
        if (!trivia) {
            throw new common_1.NotFoundException('Trivia no encontrada.');
        }
        if (trivia.userId !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a esta trivia.');
        }
        return trivia;
    }
    async updateTrivia(id, userId, updateTriviaDto) {
        const trivia = await this.getTriviaById(id, userId);
        if (trivia.isActive) {
            throw new common_1.ForbiddenException('No puedes editar una trivia que está activa.');
        }
        // Validaciones similares a las de creación
        if (updateTriviaDto.questions && updateTriviaDto.questions.length > 10) {
            throw new common_1.ForbiddenException('No puedes tener más de 10 preguntas por trivia.');
        }
        if (updateTriviaDto.questions) {
            for (const question of updateTriviaDto.questions) {
                if (question.options.length < 2 || question.options.length > 4) {
                    throw new common_1.ForbiddenException('Cada pregunta debe tener entre 2 y 4 opciones.');
                }
                if (!question.options.includes(question.answer)) {
                    throw new common_1.ForbiddenException('La respuesta correcta debe estar entre las opciones.');
                }
            }
        }
        return this.prisma.trivia.update({
            where: { id },
            data: {
                ...updateTriviaDto,
                questions: updateTriviaDto.questions ? updateTriviaDto.questions : undefined,
            },
        });
    }
    async deleteTrivia(id, userId) {
        const trivia = await this.getTriviaById(id, userId);
        if (trivia.isActive) {
            throw new common_1.ForbiddenException('No puedes eliminar una trivia que está activa.');
        }
        return this.prisma.trivia.delete({
            where: { id },
        });
    }
    async startTrivia(id, userId) {
        const trivia = await this.getTriviaById(id, userId);
        if (trivia.isActive) {
            throw new common_1.ForbiddenException('La trivia ya está activa.');
        }
        return this.prisma.trivia.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async getTriviaRanking(id, userId) {
        const trivia = await this.getTriviaById(id, userId);
        // Aquí podrías implementar la lógica para obtener el ranking
        // Por ahora retornamos un placeholder
        return {
            triviaId: id,
            ranking: [],
            message: 'Ranking no disponible aún. La trivia debe estar activa.',
        };
    }
};
exports.TriviaService = TriviaService;
exports.TriviaService = TriviaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TriviaService);
