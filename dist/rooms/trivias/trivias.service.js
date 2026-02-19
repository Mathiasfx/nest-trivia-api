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
exports.TriviasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const rooms_service_1 = require("../rooms.service");
let TriviasService = class TriviasService {
    constructor(prisma, roomsService) {
        this.prisma = prisma;
        this.roomsService = roomsService;
    }
    async createTrivia(userId, dto) {
        // Limitar a 1 trivia por usuario
        const existing = await this.prisma.trivia.findFirst({ where: { userId } });
        if (existing)
            throw new Error('Ya tienes una trivia creada');
        if (!dto.questions || dto.questions.length > 10)
            throw new Error('Máximo 10 preguntas');
        for (const q of dto.questions) {
            if (!q.options || q.options.length < 2 || q.options.length > 4)
                throw new Error('Cada pregunta debe tener entre 2 y 4 opciones');
        }
        return this.prisma.trivia.create({ data: { ...dto, userId } });
    }
    async getTriviaByUser(userId) {
        return this.prisma.trivia.findFirst({ where: { userId } });
    }
    async getTriviaById(id, userId) {
        if (userId) {
            return this.prisma.trivia.findFirst({ where: { id, userId } });
        }
        else {
            return this.prisma.trivia.findFirst({ where: { id } });
        }
    }
    async updateTrivia(id, userId, dto) {
        return this.prisma.trivia.update({ where: { id, userId }, data: dto });
    }
    async deleteTrivia(id, userId) {
        return this.prisma.trivia.delete({ where: { id, userId } });
    }
    async startTrivia(id, userId) {
        return this.prisma.trivia.update({ where: { id, userId }, data: { isActive: true } });
    }
    async getRanking(id) {
        return this.roomsService.getRanking(id);
    }
};
exports.TriviasService = TriviasService;
exports.TriviasService = TriviasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, rooms_service_1.RoomsService])
], TriviasService);
