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
exports.RoomsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const rooms_service_1 = require("./rooms.service");
const trivias_service_1 = require("./trivias/trivias.service");
let RoomsGateway = class RoomsGateway {
    constructor(roomsService, triviasService) {
        this.roomsService = roomsService;
        this.triviasService = triviasService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        console.log('Socket data:', client.data);
        // Buscar en todas las salas si este socket está asociado a algún jugador
        let playerRemoved = false;
        Object.keys(this.roomsService['rooms']).forEach(roomId => {
            const room = this.roomsService.getRoom(roomId);
            if (room) {
                // Primero intentar por playerId guardado
                const playerId = client.data.playerId;
                if (playerId) {
                    const playerIndex = room.players.findIndex(p => p.id === playerId);
                    if (playerIndex !== -1) {
                        const removedPlayer = room.players.splice(playerIndex, 1)[0];
                        // Notificar a todos en el room que el jugador se desconectó
                        this.server.to(roomId).emit('playerLeft', { player: removedPlayer });
                        // Enviar estado actualizado del room
                        this.server.to(roomId).emit('roomState', room);
                        console.log(`Player ${removedPlayer.name} left room ${roomId} (by playerId)`);
                        playerRemoved = true;
                    }
                }
                // Si no se encontró por playerId, buscar por socket.id
                if (!playerRemoved) {
                    const playerIndex = room.players.findIndex(p => p.id === client.id);
                    if (playerIndex !== -1) {
                        const removedPlayer = room.players.splice(playerIndex, 1)[0];
                        // Notificar a todos en el room que el jugador se desconectó
                        this.server.to(roomId).emit('playerLeft', { player: removedPlayer });
                        // Enviar estado actualizado del room
                        this.server.to(roomId).emit('roomState', room);
                        console.log(`Player ${removedPlayer.name} left room ${roomId} (by socket.id)`);
                        playerRemoved = true;
                    }
                }
            }
        });
        if (!playerRemoved) {
            console.log(`No player found for disconnected client: ${client.id}`);
        }
    }
    handleJoinRoom(data, client) {
        console.log(`Player ${data.name} joining room ${data.roomId}`);
        const player = this.roomsService.joinRoom(data.roomId, data.name, data.isAdmin);
        if (!player) {
            // Room doesn't exist or game already started
            const room = this.roomsService.getRoom(data.roomId);
            if (!room) {
                console.log(`Room ${data.roomId} not found`);
                client.emit('error', {
                    type: 'ROOM_NOT_FOUND',
                    message: `La sala "${data.roomId}" no existe. Verifica el ID e intenta nuevamente.`
                });
                return { success: false, error: 'Room not found' };
            }
            else if (room.isActive) {
                console.log(`Room ${data.roomId} already started`);
                client.emit('error', {
                    type: 'GAME_ALREADY_STARTED',
                    message: `La sala "${data.roomId}" ya está en juego. No puedes unirte ahora.`
                });
                return { success: false, error: 'Game already started' };
            }
        }
        client.join(data.roomId);
        // Guardar referencia del playerId en el socket para poder eliminarlo después
        client.data.playerId = player.id;
        client.data.roomId = data.roomId;
        console.log(`Player created with ID: ${player.id}, Socket ID: ${client.id}, Admin: ${player.isAdmin}`);
        // Enviar información actualizada del room al cliente que se unió
        const room = this.roomsService.getRoom(data.roomId);
        client.emit('roomState', room);
        // Notificar a todos en el room (incluido el que se unió) sobre el nuevo jugador
        this.server.to(data.roomId).emit('playerJoined', { player });
        // Enviar estado actualizado a todos en el room para que todos vean el contador de jugadores
        this.server.to(data.roomId).emit('roomState', room);
        return { success: true, playerId: player.id };
    }
    handleStartGame(data, client) {
        console.log('Starting game in room:', data.roomId, 'for trivia:', data.triviaId);
        // Iniciar el juego real - cargar preguntas y comenzar rondas
        const room = this.roomsService.getRoom(data.roomId);
        if (room) {
            room.isActive = true;
            room.round = 0;
            // Cargar preguntas de la trivia desde la base de datos
            this.triviasService.getTriviaById(data.triviaId).then(trivia => {
                if (trivia && trivia.questions && Array.isArray(trivia.questions)) {
                    room.questions = trivia.questions.map((q) => ({
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.answer
                    }));
                    room.triviaId = data.triviaId;
                    // Enviar countdown 3-2-1 para preparar jugadores
                    this.server.to(data.roomId).emit('countdown');
                    // Después de 3 segundos, iniciar la primera ronda
                    setTimeout(() => {
                        this.startNextRound(data.roomId);
                        // Notificar a todos que el juego comenzó
                        this.server.to(data.roomId).emit('gameStarted', {
                            roomId: data.roomId,
                            totalQuestions: room.questions.length
                        });
                    }, 3000);
                }
                else {
                    console.error('No questions found in trivia');
                    client.emit('error', { message: 'La trivia no tiene preguntas' });
                }
            }).catch(error => {
                console.error('Error loading trivia questions:', error);
                client.emit('error', { message: 'No se pudieron cargar las preguntas' });
            });
        }
        return { success: true };
    }
    startNextRound(roomId) {
        const room = this.roomsService.getRoom(roomId);
        if (!room || room.round >= room.questions.length) {
            // Juego terminado - mostrar countdown final y ranking
            this.server.to(roomId).emit('gameEnding', {
                message: '¡El juego está por terminar!',
                countdown: 5
            });
            // Después de 5 segundos, mostrar ranking
            setTimeout(() => {
                const ranking = this.roomsService.getRanking(roomId);
                console.log(`🏆 Game finished in room ${roomId}! Final ranking:`, ranking);
                console.log(`📊 Total players: ${room.players.length}, Total rounds: ${room.round}`);
                this.server.to(roomId).emit('gameEnded', {
                    message: '¡Juego terminado!',
                    ranking: ranking,
                    showRanking: true
                });
                // Actualizar estado del room
                room.isActive = false;
                this.server.to(roomId).emit('roomState', room);
                console.log(`✅ Room ${roomId} game state updated to inactive`);
            }, 5000);
            return;
        }
        room.round++;
        const currentQuestion = room.questions[room.round - 1];
        room.currentQuestion = {
            question: currentQuestion.question,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.correctAnswer
        };
        // Resetear respuestas de jugadores
        room.players.forEach(player => {
            player.answeredAt = undefined;
            player.answeredCorrect = undefined;
        });
        // Enviar pregunta a todos
        this.server.to(roomId).emit('newRound', {
            round: room.round,
            question: room.currentQuestion.question,
            options: room.currentQuestion.options,
            timerSeconds: 15
        });
        // Enviar estado actualizado
        this.server.to(roomId).emit('roomState', room);
        // Automáticamente avanzar a la siguiente pregunta después de 15 segundos
        // Solo si no es la última pregunta
        if (room.round < room.questions.length) {
            setTimeout(() => {
                this.startNextRound(roomId);
            }, 15000);
        }
        else {
            // Si es la última pregunta, esperar 15 segundos y luego terminar el juego
            setTimeout(() => {
                this.startNextRound(roomId); // Esta llamada detectará que no hay más preguntas y terminará el juego
            }, 15000);
        }
    }
    handleSubmitAnswer(data, client) {
        const result = this.roomsService.submitAnswer(data.roomId, data.playerId, data.answer);
        if (result) {
            // Notificar al jugador si su respuesta fue correcta
            this.server.to(client.id).emit('answerSubmitted', {
                correct: result.correct,
                score: result.score,
            });
            // Enviar ranking actualizado a todos
            const ranking = this.roomsService.getRanking(data.roomId);
            this.server.to(data.roomId).emit('rankingUpdated', ranking);
            // Verificar si todos han respondido para avanzar a la siguiente ronda
            this.checkRoundComplete(data.roomId);
        }
        return result;
    }
    checkRoundComplete(roomId) {
        const room = this.roomsService.getRoom(roomId);
        if (!room)
            return;
        const allAnswered = room.players.every(p => p.answeredAt !== undefined);
        if (allAnswered) {
            // Esperar 2 segundos y avanzar a la siguiente ronda
            setTimeout(() => {
                const hasNextRound = this.roomsService.nextRound(roomId);
                if (hasNextRound) {
                    this.sendCurrentQuestion(roomId);
                }
                else {
                    // Fin del juego
                    const finalRanking = this.roomsService.getRanking(roomId);
                    this.server.to(roomId).emit('gameEnded', { ranking: finalRanking });
                }
            }, 2000);
        }
    }
    sendCurrentQuestion(roomId) {
        const room = this.roomsService.getRoom(roomId);
        if (room && room.currentQuestion) {
            this.server.to(roomId).emit('newRound', {
                round: room.round,
                question: room.currentQuestion.question,
                options: room.currentQuestion.options,
                timerSeconds: 15, // configurable
            });
        }
    }
    handleRoomActivated(data, client) {
        console.log('Room activated:', data.roomId);
        // Activar la sala en el servicio
        const room = this.roomsService.getRoom(data.roomId);
        if (room) {
            room.isActive = true;
            // Notificar a todos en la sala que está activa
            this.server.to(data.roomId).emit('roomActivated', {
                message: data.message,
                roomId: data.roomId
            });
            // Enviar estado actualizado
            this.server.to(data.roomId).emit('roomState', room);
        }
        return { success: true };
    }
    handleRoomDeactivated(data, client) {
        console.log('Room deactivated:', data.roomId);
        // Desactivar la sala en el servicio
        const room = this.roomsService.getRoom(data.roomId);
        if (room) {
            room.isActive = false;
            // Notificar a todos en la sala que está inactiva
            this.server.to(data.roomId).emit('roomDeactivated', {
                message: data.message,
                roomId: data.roomId
            });
            // Enviar estado actualizado
            this.server.to(data.roomId).emit('roomState', room);
        }
        return { success: true };
    }
    handleCreateRoom(data, client) {
        console.log('Creating room:', data.roomId, 'for trivia:', data.triviaId);
        // Crear la room si no existe
        let room = this.roomsService.getRoom(data.roomId);
        if (!room) {
            room = this.roomsService.createRoom(data.roomId, data.triviaId);
            console.log('Room created:', room);
        }
        return { success: true, room };
    }
    handleGetRoomState(data, client) {
        const room = this.roomsService.getRoom(data.roomId);
        if (room) {
            client.emit('roomState', room);
        }
        return { success: !!room };
    }
    handleEndGame(data, client) {
        console.log('End game request for room:', data.roomId);
        console.log('Available rooms:', Object.keys(this.roomsService['rooms']));
        const room = this.roomsService.getRoom(data.roomId);
        if (!room) {
            console.log('Room not found:', data.roomId);
            return { success: false, error: 'Room not found' };
        }
        const success = this.roomsService.endGame(data.roomId);
        if (success) {
            // Actualizar estado en la base de datos
            this.roomsService.updateTriviaStatus(data.roomId, false);
            // Notificar a todos en el room que el juego ha terminado
            this.server.to(data.roomId).emit('gameEnded', {
                message: 'El juego ha sido finalizado por el administrador',
                finalRanking: this.roomsService.getRanking(data.roomId)
            });
        }
        return { success };
    }
};
exports.RoomsGateway = RoomsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleStartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('submitAnswer'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleSubmitAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('roomActivated'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleRoomActivated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('roomDeactivated'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleRoomDeactivated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getRoomState'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleGetRoomState", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('endGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "handleEndGame", null);
exports.RoomsGateway = RoomsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/rooms',
        cors: {
            origin: '*',
            credentials: false,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: '*',
        }
    }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        trivias_service_1.TriviasService])
], RoomsGateway);
