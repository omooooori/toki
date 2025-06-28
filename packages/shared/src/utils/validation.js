"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLocation = exports.validatePassword = exports.validateEmail = exports.locationSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email('有効なメールアドレスを入力してください');
exports.passwordSchema = zod_1.z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'パスワードは大文字、小文字、数字を含む必要があります');
exports.locationSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    address: zod_1.z.string().optional(),
    placeName: zod_1.z.string().optional(),
});
const validateEmail = (email) => {
    return exports.emailSchema.safeParse(email).success;
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    return exports.passwordSchema.safeParse(password).success;
};
exports.validatePassword = validatePassword;
const validateLocation = (location) => {
    return exports.locationSchema.safeParse(location).success;
};
exports.validateLocation = validateLocation;
//# sourceMappingURL=validation.js.map