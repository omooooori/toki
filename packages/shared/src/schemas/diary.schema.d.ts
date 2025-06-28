import { z } from 'zod';
export declare const locationSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    address: z.ZodOptional<z.ZodString>;
    placeName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    latitude: number;
    longitude: number;
    address?: string | undefined;
    placeName?: string | undefined;
}, {
    latitude: number;
    longitude: number;
    address?: string | undefined;
    placeName?: string | undefined;
}>;
export declare const photoSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    thumbnailUrl: z.ZodOptional<z.ZodString>;
    takenAt: z.ZodOptional<z.ZodDate>;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
        placeName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    url: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
    thumbnailUrl?: string | undefined;
    takenAt?: Date | undefined;
}, {
    id: string;
    url: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
    thumbnailUrl?: string | undefined;
    takenAt?: Date | undefined;
}>;
export declare const diarySchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    content: z.ZodString;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
        placeName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }>>;
    photos: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        thumbnailUrl: z.ZodOptional<z.ZodString>;
        takenAt: z.ZodOptional<z.ZodDate>;
        location: z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            address: z.ZodOptional<z.ZodString>;
            placeName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
            address?: string | undefined;
            placeName?: string | undefined;
        }, {
            latitude: number;
            longitude: number;
            address?: string | undefined;
            placeName?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        url: string;
        location?: {
            latitude: number;
            longitude: number;
            address?: string | undefined;
            placeName?: string | undefined;
        } | undefined;
        thumbnailUrl?: string | undefined;
        takenAt?: Date | undefined;
    }, {
        id: string;
        url: string;
        location?: {
            latitude: number;
            longitude: number;
            address?: string | undefined;
            placeName?: string | undefined;
        } | undefined;
        thumbnailUrl?: string | undefined;
        takenAt?: Date | undefined;
    }>, "many">;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    content: string;
    photos: {
        id: string;
        url: string;
        location?: {
            latitude: number;
            longitude: number;
            address?: string | undefined;
            placeName?: string | undefined;
        } | undefined;
        thumbnailUrl?: string | undefined;
        takenAt?: Date | undefined;
    }[];
    createdAt: Date;
    updatedAt: Date;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
}, {
    id: string;
    userId: string;
    content: string;
    photos: {
        id: string;
        url: string;
        location?: {
            latitude: number;
            longitude: number;
            address?: string | undefined;
            placeName?: string | undefined;
        } | undefined;
        thumbnailUrl?: string | undefined;
        takenAt?: Date | undefined;
    }[];
    createdAt: Date;
    updatedAt: Date;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
}>;
export declare const createDiarySchema: z.ZodObject<{
    content: z.ZodString;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
        placeName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }>>;
    photoUrls: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    content: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
    photoUrls?: string[] | undefined;
}, {
    content: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
    photoUrls?: string[] | undefined;
}>;
export declare const updateDiarySchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
        placeName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }, {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    }>>;
    photoUrls: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    content?: string | undefined;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
    photoUrls?: string[] | undefined;
}, {
    content?: string | undefined;
    location?: {
        latitude: number;
        longitude: number;
        address?: string | undefined;
        placeName?: string | undefined;
    } | undefined;
    photoUrls?: string[] | undefined;
}>;
export type DiaryInput = z.infer<typeof diarySchema>;
export type CreateDiaryInput = z.infer<typeof createDiarySchema>;
export type UpdateDiaryInput = z.infer<typeof updateDiarySchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type PhotoInput = z.infer<typeof photoSchema>;
//# sourceMappingURL=diary.schema.d.ts.map