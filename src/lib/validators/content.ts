import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000),
  parentId: z.string().optional().nullable(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional().nullable(),
  subject: z.string().min(2, "Subject is required").max(120),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});

export const ticketSchema = z.object({
  subject: z.string().min(2, "Subject is required").max(120),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  category: z.string().max(40).optional().nullable(),
});

export const ticketMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(3000),
});

export const testimonialSchema = z.object({
  content: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  programId: z.string().optional().nullable(),
});

export const galleryImageSchema = z.object({
  title: z.string().max(80).optional().nullable(),
  category: z.string().max(40).optional().nullable(),
  imageUrl: z.string().url("Valid image URL required"),
});

export const faqSchema = z.object({
  question: z.string().min(3).max(300),
  answer: z.string().min(3).max(3000),
  category: z.string().max(40).optional().nullable(),
  order: z.number().int().min(0).default(0),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(["all", "members", "trainers", "programs", "classes", "blog", "exercises"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
