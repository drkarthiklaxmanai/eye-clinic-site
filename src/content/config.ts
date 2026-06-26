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

// Page-specific objection-handling FAQs, written directly per page
    // rather than filtered from the global faqs collection. Each page's
    // booking objections are genuinely different (Cataract vs. LASIK
    // vs. Diabetic Eye) -- keyword filtering produced generic,
    // educational answers, not objection-handling ones. Exactly 3 per
    // page: condition-specific objection, urgency, trust.
    landingFaqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),

    // Condition-specific "what could be causing this" content.
    // Only populated on symptom-intent pages where the cause is
    // genuinely ambiguous (e.g. blurred vision, eye pain) -- not
    // service-intent pages where the diagnosis is already known.
    causeExploration: z.object({
      title: z.string(),
      causesIntro: z.string(),
      commonCauses: z.array(z.string()),
      causesOutro: z.string().optional(),
      urgentTitle: z.string(),
      urgentIntro: z.string(),
      urgentScenarios: z.array(z.string()),
    }).optional(),

    // Personal, first-person framing from Dr. Rajeswari -- the one thing
    // a corporate hospital chain cannot replicate at scale. Used by
    // earlier pages (Cataract, LASIK) as free-form prose. Kept alongside
    // doctorsPerspectiveStructured below for backward compatibility.
    doctorsPerspective: z.string().optional(),

    // Decision-support: "what happens after evaluation" pathways,
    // mapped by possible finding -> next step. Replaces vague
    // reassurance with a concrete sense of what to expect.
    afterEvaluation: z.array(z.object({
      finding: z.string(),
      nextStep: z.string(),
    })).optional(),

    // Reusable across any "patient feels fine, doesn't realize they
    // need screening" page (Diabetic Eye, future Glaucoma, future
    // Retina). One configurable component instead of forking a new
    // one per condition -- keeps this maintainable past 11 pages.
    educationalInsight: z.object({
      title: z.string(),
      body: z.string(),
      pathway: z.object({
        steps: z.array(z.string()),
        branches: z.array(z.object({
          finding: z.string(),
          outcome: z.string(),
        })).optional(),
      }).optional(),
      prioritizeIf: z.array(z.string()).optional(),
    }).optional(),

    // Standardized structure for doctorsPerspective, replacing the
    // free-form string for NEW pages going forward. Keeps a consistent
    // "patient concern -> doctor response" shape across pages while
    // content stays page-specific.
    doctorsPerspectiveStructured: z.object({
      patientConcern: z.string(),
      response: z.string(),
    }).optional(),

    // Surgical decision-support, distinct from CauseExploration and
    // educationalInsight. Used on LASIK/Cataract -- the patient already
    // knows the condition; the anxiety is whether/when to proceed.
    decisionSupport: z.object({
      suitabilityTitle: z.string(),
      suitabilityIntro: z.string(),
      evaluationSteps: z.array(z.string()),
      notSuitableTitle: z.string().optional(),
      notSuitableReasons: z.array(z.string()).optional(),
      lensOptions: z.array(z.object({
        name: z.string(),
        benefit: z.string(),
      })).optional(),
    }).optional(),
  }),
});

export const collections = {
  'faqs': faqCollection,
  'blog': blogCollection,
  'landingPages': landingPageCollection,
};
