"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
let RoomsService = class RoomsService {
    constructor() {
        this.rooms = {};
    }
    createRoom(roomId, triviaId) {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = {
                id: roomId,
                players: [],
                round: 0,
                isActive: false,
                gameStarted: false,
                currentQuestion: undefined,
                questions: [],
                triviaId: triviaId
            };
        }
        return this.rooms[roomId];
    }
    joinRoom(roomId, playerName, isAdmin = false) {
        if (!this.rooms[roomId]) {
            return null;
        }
        if (this.rooms[roomId].gameStarted) {
            return null;
        }
        const player = {
            id: Math.random().toString(36).substring(2, 10),
            name: playerName,
            score: isAdmin ? 0 : 0,
            isAdmin
        };
        this.rooms[roomId].players.push(player);
        return player;
    }
    getRoom(roomId) {
        return this.rooms[roomId];
    }
    startGame(roomId, questions) {
        const room = this.rooms[roomId];
        if (room && !room.gameStarted) {
            room.isActive = true;
            room.gameStarted = true;
            room.round = 1;
            room.questions = questions;
            this.setCurrentQuestion(roomId);
            return true;
        }
        return false;
    }
    setCurrentQuestion(roomId) {
        const room = this.rooms[roomId];
        if (room && room.questions[room.round - 1]) {
            room.currentQuestion = room.questions[room.round - 1];
            room.roundStartTime = Date.now();
            // Reset player answers for la ronda
            room.players.forEach(p => {
                p.answeredAt = undefined;
                p.answeredCorrect = false;
            });
        }
    }
    submitAnswer(roomId, playerId, answer) {
        const room = this.rooms[roomId];
        if (!room || !room.isActive)
            return null;
        const player = room.players.find(p => p.id === playerId);
        if (!player || player.answeredAt || player.isAdmin)
            return null;
        player.answeredAt = Date.now();
        const correct = answer.trim().toLowerCase() === (room.currentQuestion?.correctAnswer?.trim().toLowerCase() ?? '');
        player.answeredCorrect = correct;
        if (correct) {
            const timeElapsed = player.answeredAt - (room.roundStartTime || player.answeredAt);
            const roundDuration = 15000; // 15 segundos en ms
            const speedBonus = Math.max(0, Math.round(90 * (1 - timeElapsed / roundDuration)));
            player.score += 10 + speedBonus;
        }
        return { correct, score: player.score };
    }
    nextRound(roomId) {
        const room = this.rooms[roomId];
        if (!room || !room.isActive)
            return false;
        if (room.round < room.questions.length) {
            room.round++;
            this.setCurrentQuestion(roomId);
            return true;
        }
        else {
            room.isActive = false;
            return false;
        }
    }
    getRanking(roomId) {
        const room = this.rooms[roomId];
        if (!room)
            return [];
        return [...room.players]
            .filter(p => !p.isAdmin) // Excluir al administrador del ranking
            .sort((a, b) => b.score - a.score);
    }
    endGame(roomId) {
        const room = this.rooms[roomId];
        if (!room)
            return false;
        room.gameStarted = false;
        room.isActive = true;
        room.currentQuestion = undefined;
        room.round = 0;
        room.players = [];
        return true;
    }
    updateTriviaStatus(roomId, isActive) {
        // Aquí iría la lógica para actualizar la base de datos
        // Por ahora solo actualizamos el estado en memoria
        const room = this.rooms[roomId];
        if (room) {
            room.isActive = isActive;
            return true;
        }
        return false;
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)()
], RoomsService);
