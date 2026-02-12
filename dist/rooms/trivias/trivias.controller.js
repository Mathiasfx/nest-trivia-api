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
exports.TriviasController = void 0;
const common_1 = require("@nestjs/common");
const trivias_service_1 = require("./trivias.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let TriviasController = class TriviasController {
    constructor(triviasService) {
        this.triviasService = triviasService;
    }
    createTrivia(req, dto) {
        return this.triviasService.createTrivia(req.user.userId, dto);
    }
    getMyTrivia(req) {
        return this.triviasService.getTriviaByUser(req.user.userId);
    }
    getTriviaById(id, req) {
        return this.triviasService.getTriviaById(id, req.user.userId);
    }
    updateTrivia(id, dto, req) {
        return this.triviasService.updateTrivia(id, req.user.userId, dto);
    }
    deleteTrivia(id, req) {
        return this.triviasService.deleteTrivia(id, req.user.userId);
    }
    startTrivia(id, req) {
        return this.triviasService.startTrivia(id, req.user.userId);
    }
    getRanking(id) {
        return this.triviasService.getRanking(id);
    }
};
exports.TriviasController = TriviasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "createTrivia", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.Header)('Cache-Control', 'no-cache, no-store, must-revalidate'),
    (0, common_1.Header)('Pragma', 'no-cache'),
    (0, common_1.Header)('Expires', '0'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "getMyTrivia", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "getTriviaById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "updateTrivia", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "deleteTrivia", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "startTrivia", null);
__decorate([
    (0, common_1.Get)(':id/ranking'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TriviasController.prototype, "getRanking", null);
exports.TriviasController = TriviasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rooms/trivias'),
    __metadata("design:paramtypes", [trivias_service_1.TriviasService])
], TriviasController);
