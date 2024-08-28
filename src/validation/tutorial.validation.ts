import { z } from 'zod';

export const CreateTutorialSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
});

export const UpdateTutorialSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title is too long')
    .optional(),
  content: z.string().min(1, 'Content is required').optional(),
});

export const FilterTutorialSchema = z.object({
  title: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
});
