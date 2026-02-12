import { TriviaService } from './trivia.service';
import { CreateTriviaDto, UpdateTriviaDto } from './dto/trivia.dto';
export declare class TriviaController {
    private readonly triviaService;
    constructor(triviaService: TriviaService);
    create(req: any, createTriviaDto: CreateTriviaDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    findMyTrivias(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    update(id: string, req: any, updateTriviaDto: UpdateTriviaDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        questions: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    remove(id: string, req: any): Promise<{
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
    getRanking(id: string, req: any): Promise<{
        triviaId: string;
        ranking: any[];
        message: string;
    }>;
}
