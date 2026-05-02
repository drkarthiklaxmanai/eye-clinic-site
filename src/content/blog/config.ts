import { defineCollection, z } from 'astro:content';

const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    order: z.number().optional(), // To control which question shows first
  }),
});

export const collections = {
  'faqs': faqCollection,
};
