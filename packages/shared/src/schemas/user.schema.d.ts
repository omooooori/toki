import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name?: string | undefined;
}, {
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name?: string | undefined;
}>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name?: string | undefined;
}, {
    email: string;
    name?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type UserInput = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=user.schema.d.ts.map