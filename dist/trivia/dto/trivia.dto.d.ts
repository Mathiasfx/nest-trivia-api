export declare class QuestionDto {
    question: string;
    options: string[];
    answer: string;
}
export declare class CreateTriviaDto {
    title: string;
    questions: QuestionDto[];
}
export declare class UpdateTriviaDto {
    title?: string;
    questions?: QuestionDto[];
}
