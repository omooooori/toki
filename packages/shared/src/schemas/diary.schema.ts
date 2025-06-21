import { z } from 'zod';

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  placeName: z.string().optional(),
});

export const photoSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url('有効なURLを入力してください'),
  thumbnailUrl: z.string().url('有効なURLを入力してください').optional(),
  takenAt: z.date().optional(),
  location: locationSchema.optional(),
});

export const diarySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(10, '日記は10文字以上で入力してください').max(10000, '日記は10000文字以内で入力してください'),
  location: locationSchema.optional(),
  photos: z.array(photoSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDiarySchema = z.object({
  content: z.string().min(10, '日記は10文字以上で入力してください').max(10000, '日記は10000文字以内で入力してください'),
  location: locationSchema.optional(),
  photoUrls: z.array(z.string().url('有効なURLを入力してください')).optional(),
});

export const updateDiarySchema = z.object({
  content: z.string().min(10, '日記は10文字以上で入力してください').max(10000, '日記は10000文字以内で入力してください').optional(),
  location: locationSchema.optional(),
  photoUrls: z.array(z.string().url('有効なURLを入力してください')).optional(),
});

export type DiaryInput = z.infer<typeof diarySchema>;
export type CreateDiaryInput = z.infer<typeof createDiarySchema>;
export type UpdateDiaryInput = z.infer<typeof updateDiarySchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type PhotoInput = z.infer<typeof photoSchema>; 