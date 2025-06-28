import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
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
export declare const validateEmail: (email: string) => boolean;
export declare const validatePassword: (password: string) => boolean;
export declare const validateLocation: (location: any) => boolean;
//# sourceMappingURL=validation.d.ts.map