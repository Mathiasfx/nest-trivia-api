import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { TriviasService } from './trivias/trivias.service';
export declare class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private roomsService;
    private triviasService;
    server: Server;
    constructor(roomsService: RoomsService, triviasService: TriviasService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        roomId: string;
        name: string;
        isAdmin?: boolean;
    }, client: Socket): {
        success: boolean;
        error: string;
        playerId?: undefined;
    } | {
        success: boolean;
        playerId: string;
        error?: undefined;
    };
    handleStartGame(data: {
        roomId: string;
        triviaId: string;
    }, client: Socket): {
        success: boolean;
    };
    private startNextRound;
    handleSubmitAnswer(data: {
        roomId: string;
        playerId: string;
        answer: string;
    }, client: Socket): {
        correct: boolean;
        score: number;
    };
    private checkRoundComplete;
    private sendCurrentQuestion;
    handleRoomActivated(data: {
        roomId: string;
        message: string;
    }, client: Socket): {
        success: boolean;
    };
    handleRoomDeactivated(data: {
        roomId: string;
        message: string;
    }, client: Socket): {
        success: boolean;
    };
    handleCreateRoom(data: {
        roomId: string;
        triviaId: string;
    }, client: Socket): {
        success: boolean;
        room: import("./rooms.service").Room;
    };
    handleGetRoomState(data: {
        roomId: string;
    }, client: Socket): {
        success: boolean;
    };
    handleEndGame(data: {
        roomId: string;
    }, client: Socket): {
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    };
}
