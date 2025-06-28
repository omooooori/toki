export interface DatabaseConfig {
    type: 'firebase' | 'prisma';
    firebase?: {
        projectId: string;
        privateKey: string;
        clientEmail: string;
    };
    prisma?: {
        databaseUrl: string;
    };
}
export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Diary {
    id: string;
    userId: string;
    content: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
        placeName?: string;
    };
    photos?: Array<{
        id: string;
        url: string;
        thumbnailUrl?: string;
        takenAt?: Date;
        location?: {
            latitude: number;
            longitude: number;
            address?: string;
            placeName?: string;
        };
    }>;
    aiAnalysis?: {
        sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
        topics: string[];
        summary?: string;
        suggestions?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateDiaryInput {
    userId: string;
    content: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
        placeName?: string;
    };
    photoUrls?: string[];
}
export interface UpdateDiaryInput {
    content?: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
        placeName?: string;
    };
    photoUrls?: string[];
    aiAnalysis?: {
        sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
        topics: string[];
        summary?: string;
        suggestions?: string[];
    };
}
export interface DiaryQueryOptions {
    userId: string;
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
}
//# sourceMappingURL=database.types.d.ts.map