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
    urgent: z.boolean().optional().default(false),
    metaDescription: z.string(),

    // Page-specific differentiators, appended to the 3 universal cards
    whyPatientsChoose: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional().default([]),

    showSymptomCheck: z.boolean().optional().default(false),
    symptoms: z.array(z.string()).optional(),

    processSteps: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),

    showObjectionFAQ: z.boolean().optional().default(true),
    faqTopicKeywords: z.array(z.string()).optional(),

    // Condition-specific "what could be causing this" content.
    // Only populated on symptom-intent pages where the cause is
    // genuinely ambiguous (e.g. blurred vision, eye pain) -- not
    // service-intent pages where the diagnosis is already known.
    causeExploration: z.object({
      causesIntro: z.string(),
      commonCauses: z.array(z.string()),
      urgentIntro: z.string(),
      urgentScenarios: z.array(z.string()),
    }).optional(),
  }),
});

export const collections = {
  'faqs': faqCollection,
  'blog': blogCollection,
  'landingPages': landingPageCollection,
};
