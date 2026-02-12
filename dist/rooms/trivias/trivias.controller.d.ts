import { TriviasService } from './trivias.service';
export declare class TriviasController {
    private readonly triviasService;
    constructor(triviasService: TriviasService);
    createTrivia(req: any, dto: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getMyTrivia(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getTriviaById(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    updateTrivia(id: string, dto: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    deleteTrivia(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    startTrivia(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getRanking(id: string): Promise<any[]>;
}
