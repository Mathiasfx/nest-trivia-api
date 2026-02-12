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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriviaController = void 0;
const common_1 = require("@nestjs/common");
const trivia_service_1 = require("./trivia.service");
const trivia_dto_1 = require("./dto/trivia.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TriviaController = class TriviaController {
    constructor(triviaService) {
        this.triviaService = triviaService;
    }
    create(req, createTriviaDto) {
        return this.triviaService.createTrivia(req.user.userId, createTriviaDto);
    }
    findMyTrivias(req) {
        return this.triviaService.getMyTrivia(req.user.userId);
    }
    findOne(id, req) {
        return this.triviaService.getTriviaById(id, req.user.userId);
    }
    update(id, req, updateTriviaDto) {
        return this.triviaService.updateTrivia(id, req.user.userId, updateTriviaDto);
    }
    remove(id, req) {
        return this.triviaService.deleteTrivia(id, req.user.userId);
    }
    startTrivia(id, req) {
        return this.triviaService.startTrivia(id, req.user.userId);
    }
    getRanking(id, req) {
        return this.triviaService.getTriviaRanking(id, req.user.userId);
    }
};
exports.TriviaController = TriviaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trivia_dto_1.CreateTriviaDto]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "findMyTrivias", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trivia_dto_1.UpdateTriviaDto]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "startTrivia", null);
__decorate([
    (0, common_1.Get)(':id/ranking'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviaController.prototype, "getRanking", null);
exports.TriviaController = TriviaController = __decorate([
    (0, common_1.Controller)('trivias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trivia_service_1.TriviaService])
], TriviaController);
