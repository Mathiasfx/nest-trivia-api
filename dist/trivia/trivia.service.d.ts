import { PrismaService } from '../prisma.service';
import { CreateTriviaDto, UpdateTriviaDto } from './dto/trivia.dto';
export declare class TriviaService {
    private prisma;
    constructor(prisma: PrismaService);
    createTrivia(userId: string, createTriviaDto: CreateTriviaDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getMyTrivia(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }[]>;
    getTriviaById(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    updateTrivia(id: string, userId: string, updateTriviaDto: UpdateTriviaDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    deleteTrivia(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    startTrivia(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getTriviaRanking(id: string, userId: string): Promise<{
        triviaId: string;
        ranking: any[];
        message: string;
    }>;
}
