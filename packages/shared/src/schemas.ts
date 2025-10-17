import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const projectSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  title: z.string().min(1).max(255),
  summary: z.string().min(1).max(500),
  body_mdx: z.string().min(1),
  tags: z.array(z.string()).max(10),
  repo_url: z.string().url().optional().or(z.literal('')),
  live_url: z.string().url().optional().or(z.literal('')),
  cover_image: z.string().url().optional().or(z.literal('')),
  gallery: z.record(z.any()).optional(),
  stack: z.array(z.string()).max(20),
  featured: z.boolean().default(false),
  published_at: z.string().datetime().optional().nullable(),
});

export const postSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  title: z.string().min(1).max(255),
  excerpt: z.string().min(1).max(500),
  body_mdx: z.string().min(1),
  cover_image: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).max(10),
  published_at: z.string().datetime().optional().nullable(),
});

export const pageViewSchema = z.object({
  path: z.string().min(1).max(255),
  slug: z.string().max(255).optional(),
  content_type: z.enum(['post', 'project', 'page']).optional(),
  user_hash: z.string().min(1).max(64),
  country: z.string().max(2).optional(),
  referrer: z.string().max(255).optional(),
  read_ms: z.number().int().min(0).optional(),
  scroll_pct: z.number().int().min(0).max(100).optional(),
});

export const eventSchema = z.object({
  name: z.string().min(1).max(100),
  content_type: z.enum(['post', 'project', 'page']).optional(),
  slug: z.string().max(255).optional(),
  meta: z.record(z.any()).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type PageViewInput = z.infer<typeof pageViewSchema>;
export type EventInput = z.infer<typeof eventSchema>;