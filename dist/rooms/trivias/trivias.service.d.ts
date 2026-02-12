import { PrismaService } from '../../prisma.service';
export declare class TriviasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTrivia(userId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getTriviaByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getTriviaById(id: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    updateTrivia(id: string, userId: string, dto: any): Promise<{
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
    getRanking(id: string): Promise<any[]>;
}
