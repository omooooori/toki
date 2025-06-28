"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email('有効なメールアドレスを入力してください'),
    name: zod_1.z.string().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください').optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('有効なメールアドレスを入力してください'),
    name: zod_1.z.string().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください').optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください').optional(),
});
//# sourceMappingURL=user.schema.js.map