import { z } from 'zod';
import { VIBE_SLOTS, SUBCULTURES } from './constants';

export const IntentSchema = z.object({
  subject: z.string(),
  emotional_tone: z.string(),
  subculture: z.enum(SUBCULTURES).nullable(),
  image_description: z.string().nullable(),
  vibe_fits: z.object({
    agree: z.string(),
    mock: z.string(),
    shocked: z.string(),
    wholesome: z.string(),
    savage: z.string(),
  }),
  avoid: z.array(z.string()),
  serious: z.boolean(),
});
export type Intent = z.infer<typeof IntentSchema>;

export const QuerySetSchema = z.object({
  agree: z.array(z.string()).length(3),
  mock: z.array(z.string()).length(3),
  shocked: z.array(z.string()).length(3),
  wholesome: z.array(z.string()).length(3),
  savage: z.array(z.string()).length(3),
});
export type QuerySet = z.infer<typeof QuerySetSchema>;

// Combined analyze output — fuses Intent + QuerySet into one LLM response
// so the pipeline can skip the second round-trip.
export const AnalyzedTweetSchema = IntentSchema.extend({
  queries: QuerySetSchema,
});
export type AnalyzedTweet = z.infer<typeof AnalyzedTweetSchema>;

export const CandidateSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  preview_url: z.string().url(),
  title: z.string(),
  tags: z.array(z.string()),
  source: z.enum(['giphy', 'tenor']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type Candidate = z.infer<typeof CandidateSchema>;

export const SearchResponseSchema = z.object({
  candidates: z.array(CandidateSchema),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const RerankedSlotSchema = z.object({
  id: z.string(),
  score: z.number().min(0).max(10),
});
export const RerankResultSchema = z.object({
  agree: z.array(RerankedSlotSchema).length(3),
  mock: z.array(RerankedSlotSchema).length(3),
  shocked: z.array(RerankedSlotSchema).length(3),
  wholesome: z.array(RerankedSlotSchema).length(3),
  savage: z.array(RerankedSlotSchema).length(3),
});
export type RerankResult = z.infer<typeof RerankResultSchema>;

export const SettingsSchema = z.object({
  humorProfile: z.object({
    styles: z.object({
      darkVsWholesome: z.number().min(-100).max(100),
      absurdistVsObservational: z.number().min(-100).max(100),
      dryVsHyper: z.number().min(-100).max(100),
      politicalVsApolitical: z.number().min(-100).max(100),
    }),
    enabledSubcultures: z.array(z.enum(SUBCULTURES)),
    blocklist: z.array(z.string()),
  }),
  behavior: z.object({
    sendImagesToLLM: z.boolean(),
    logHistoryLocally: z.boolean(),
  }),
  installId: z.string().uuid(),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const TweetContextSchema = z.object({
  tweetId: z.string(),
  authorHandle: z.string(),
  authorBio: z.string().optional(),
  text: z.string(),
  imageUrls: z.array(z.string().url()),
  quotedTweet: z.string().optional(),
  threadContext: z.array(z.string()).max(5),
});
export type TweetContext = z.infer<typeof TweetContextSchema>;

export const SuggestionSchema = z.object({
  slot: z.enum(VIBE_SLOTS),
  candidate: CandidateSchema,
  score: z.number().min(0).max(10),
  alternates: z.array(CandidateSchema).max(2),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;
