import { defineCollection, z } from 'astro:content';

const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    order: z.number().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

// Ad / Google Ads landing pages -- one entry per campaign/ad group.
const landingPageCollection = defineCollection({
  type: 'data',
  schema: z.object({
    headline: z.string(),
    subheadline: z.string(),
    urgent: z.boolean().optional(),
    metaDescription: z.string(),
    symptomsTitle: z.string().optional(),
    symptoms: z.array(z.string()).optional(),
    processTitle: z.string().optional(),
    processSteps: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    faqTopicKeywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'faqs': faqCollection,
  'blog': blogCollection,
  'landingPages': landingPageCollection,
};
