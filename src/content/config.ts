import { defineCollection, z } from 'astro:content';

const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    order: z.number().optional(), // To control which question shows first
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
  }),
});

export const collections = {
  'faqs': faqCollection,
  'blog': blogCollection,
};
