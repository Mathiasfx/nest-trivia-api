export interface RoomPlayer {
    id: string;
    name: string;
    score: number;
    answeredAt?: number;
    answeredCorrect?: boolean;
    isAdmin?: boolean;
}
interface TriviaQuestion {
    question: string;
    options: string[];
    correctAnswer?: string;
}
export interface Room {
    id: string;
    players: RoomPlayer[];
    currentQuestion?: {
        question: string;
        options: string[];
        correctAnswer?: string;
    };
    round: number;
    isActive: boolean;
    questions: TriviaQuestion[];
    triviaId?: string;
}
export declare class RoomsService {
    private rooms;
    createRoom(roomId: string, triviaId?: string): Room;
    joinRoom(roomId: string, playerName: string, isAdmin?: boolean): RoomPlayer | null;
    getRoom(roomId: string): Room | undefined;
    startGame(roomId: string, questions: TriviaQuestion[]): boolean;
    setCurrentQuestion(roomId: string): void;
    submitAnswer(roomId: string, playerId: string, answer: string): {
        correct: boolean;
        score: number;
    } | null;
    nextRound(roomId: string): boolean;
    getRanking(roomId: string): RoomPlayer[];
    endGame(roomId: string): boolean;
    updateTriviaStatus(roomId: string, isActive: boolean): boolean;
}
export {};
