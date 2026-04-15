export interface ToolField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  labels?: string[];
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  desc: string;
  fields: ToolField[];
  badge?: string;
  badgeColor?: string;
  acq?: boolean;
  campaignLabel?: string;
  communityLabel?: string;
}

export const CAMPAIGN_TOOLS: Tool[] = [
  {
    id: 'character_post',
    name: 'Character Post',
    icon: '✍',
    acq: true,
    desc: 'Write as the character — blog, social, Discord. Fully in voice.',
    fields: [
      { id: 'platform', label: 'Platform', type: 'select', options: ['TikTok', 'X / Twitter', 'Blog post', 'Discord', 'Instagram', 'Telegram'] },
      { id: 'topic', label: 'Topic / theme', type: 'text', placeholder: 'e.g. The casino is open, new game launch, a message to players…' },
      { id: 'tone_note', label: 'Tone note', type: 'text', placeholder: 'e.g. More mysterious, playful, urgent… (optional)' },
    ],
  },
  {
    id: 'veo_brief',
    name: 'Veo / Imagen Brief',
    icon: '🎬',
    acq: true,
    desc: 'Structured Veo 3 video or Imagen stills brief. Paste-ready for production.',
    fields: [
      { id: 'concept', label: 'Scene concept', type: 'text', placeholder: 'e.g. Kiki deals cards at midnight, champagne in hand…' },
      { id: 'output_type', label: 'Output type', type: 'select', options: ['Video — Veo 3', 'Still image — Imagen / Gemini', 'Image series — Imagen / Gemini'] },
      { id: 'mood', label: 'Mood / visual reference', type: 'text', placeholder: 'e.g. Film noir, golden hour neon, cosmic deep space…' },
    ],
  },
  {
    id: 'campaign_brief',
    name: 'Campaign Brief',
    icon: '📋',
    acq: true,
    desc: "Objective → structured brief anchored in the character's world.",
    fields: [
      { id: 'objective', label: 'Campaign objective', type: 'text', placeholder: 'e.g. Drive pre-registrations, announce launch…' },
      { id: 'segment', label: 'Target segment', type: 'text', placeholder: 'e.g. Crypto-native 25–35, lapsed players…' },
      { id: 'channels', label: 'Channel(s)', type: 'text', placeholder: 'e.g. TikTok + X, email sequence…' },
      { id: 'timeline', label: 'Timeline', type: 'text', placeholder: 'e.g. 2-week sprint, rolling 30 days…' },
    ],
  },
  {
    id: 'promo_framing',
    name: 'Promo / Offer Framing',
    icon: '🎰',
    acq: false,
    desc: "Bonus or offer copy through the character's voice.",
    fields: [
      { id: 'offer', label: 'Offer mechanic', type: 'text', placeholder: 'e.g. 100% deposit match to $500, 50 free spins…' },
      { id: 'audience', label: 'Target audience', type: 'text', placeholder: 'e.g. New crypto depositors, returning players…' },
      { id: 'platform', label: 'Platform', type: 'select', options: ['Email', 'X / Twitter', 'TikTok', 'Landing page', 'Push notification', 'Discord'] },
    ],
  },
  {
    id: 'lifecycle_msg',
    name: 'Lifecycle Message',
    icon: '💌',
    acq: false,
    desc: 'Retention or reactivation message. Personal, from the character.',
    fields: [
      { id: 'segment', label: 'Player segment', type: 'text', placeholder: 'e.g. Lapsed 30 days, first depositor, VIP…' },
      { id: 'trigger', label: 'Trigger / occasion', type: 'text', placeholder: 'e.g. 30-day inactivity, first deposit, birthday…' },
      { id: 'channel', label: 'Channel', type: 'select', options: ['Email', 'Push notification', 'SMS', 'In-app message', 'Discord DM'] },
    ],
  },
  {
    id: 'lore_drop',
    name: 'Lore Drop',
    icon: '📖',
    acq: false,
    desc: "Expand the character's world. Canon-safe lore for blog, Discord, social.",
    fields: [
      { id: 'focus', label: 'Focus area', type: 'text', placeholder: 'e.g. How Kiki first opened the casino, origins of the Throne…' },
      { id: 'format', label: 'Format', type: 'select', options: ['Blog post', 'Discord lore thread', 'Social caption series', 'Short story fragment', 'Character monologue'] },
    ],
  },
];

export const COMMUNITY_TOOLS: Tool[] = [
  {
    id: 'player_article',
    name: 'Player Article',
    icon: '📰',
    desc: 'Community-voice editorial. Player-authentic. Can surface owned brands organically.',
    fields: [
      { id: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. Why crypto casinos are winning in 2026…' },
      { id: 'angle', label: 'Angle / position', type: 'text', placeholder: 'e.g. Contrarian take, enthusiastic recommendation…' },
      { id: 'brands', label: 'Brands to mention', type: 'text', placeholder: "e.g. Kiki's Casino, Orion's Fortune (optional)" },
    ],
  },
  {
    id: 'discord_post',
    name: 'Discord Post',
    icon: '💬',
    desc: 'Peer-tone community content native to Discord.',
    fields: [
      { id: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. New slot mechanic, hot streak strategy…' },
      { id: 'post_type', label: 'Post type', type: 'select', options: ['Hot take', 'Question to community', 'News / update', 'Recommendation', 'Discussion starter'] },
    ],
  },
  {
    id: 'hot_take',
    name: 'Hot Take',
    icon: '🔥',
    desc: 'Short-form opinion that builds community credibility.',
    fields: [
      { id: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. Provably fair casinos, crypto bonus structures…' },
      { id: 'position', label: 'Your position', type: 'text', placeholder: "e.g. Overrated and here's why…" },
    ],
  },
  {
    id: 'brand_weave',
    name: 'Brand Mention Weave',
    icon: '🧵',
    desc: 'Annotate any draft with natural brand mention opportunities.',
    fields: [
      { id: 'draft', label: 'Paste your draft', type: 'textarea', placeholder: 'Paste the article or copy to annotate…' },
      { id: 'brands', label: 'Brands to weave in', type: 'text', placeholder: "e.g. Kiki's Casino, Orion's Fortune" },
    ],
  },
  {
    id: 'newsletter',
    name: 'Newsletter Draft',
    icon: '📧',
    desc: 'Community editorial roundup. Player-first, subtle brand integration.',
    fields: [
      { id: 'themes', label: "This week's themes", type: 'text', placeholder: 'e.g. Big crypto casino launches, strategy trends…' },
      { id: 'featured', label: 'Featured content / mentions', type: 'text', placeholder: "e.g. Kiki's prelaunch, hot take on live dealers…" },
    ],
  },
  {
    id: 'concept_sandbox',
    name: 'Concept Sandbox',
    icon: '🧪',
    desc: 'Flesh out new CHUR.BET directions. Builds the brand brief over time.',
    fields: [
      { id: 'idea', label: 'Idea to explore', type: 'textarea', placeholder: 'e.g. Weekly player interview series? Live odds discussion channel?…' },
    ],
  },
];

export const INTEL_TOOLS: Tool[] = [
  {
    id: 'keyword_compass',
    name: 'Keyword Compass',
    icon: '🧭',
    badge: 'Ahrefs live',
    badgeColor: '#a8c898',
    desc: 'Live keyword data — volume, difficulty, related terms, content direction per brand.',
    fields: [
      { id: 'keyword', label: 'Seed keyword', type: 'text', placeholder: 'e.g. crypto casino, no KYC casino, anonymous gambling…' },
      { id: 'country', label: 'Country', type: 'select', options: ['us', 'gb', 'ca', 'au', 'de', 'nl', 'se', 'nz', 'za', 'ie'], labels: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Sweden', 'New Zealand', 'South Africa', 'Ireland'] },
      { id: 'context', label: 'Content context', type: 'text', placeholder: "e.g. blog post for CHUR.BET, landing page for Orion's… (optional)" },
    ],
  },
  {
    id: 'competitor_intel',
    name: 'Competitor Intel',
    icon: '🔭',
    badge: 'Ahrefs live',
    badgeColor: '#a8c898',
    desc: 'Enter a competitor domain — see their keyword profile and where your gaps are.',
    fields: [
      { id: 'domain', label: 'Competitor domain', type: 'text', placeholder: 'e.g. stake.com, betway.com, rocketplay.com…' },
      { id: 'country', label: 'Country', type: 'select', options: ['us', 'gb', 'ca', 'au', 'de', 'nl', 'se', 'nz', 'za', 'ie'], labels: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Sweden', 'New Zealand', 'South Africa', 'Ireland'] },
    ],
  },
  {
    id: 'serp_snapshot',
    name: 'SERP Snapshot',
    icon: '📡',
    badge: 'Ahrefs live',
    badgeColor: '#a8c898',
    desc: "See exactly who owns a keyword and how hard it is to break in.",
    fields: [
      { id: 'keyword', label: 'Target keyword', type: 'text', placeholder: 'e.g. best crypto casino, anonymous online casino, no KYC slots…' },
      { id: 'country', label: 'Country', type: 'select', options: ['us', 'gb', 'ca', 'au', 'de', 'nl', 'se', 'nz', 'za', 'ie'], labels: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Sweden', 'New Zealand', 'South Africa', 'Ireland'] },
    ],
  },
  {
    id: 'ai_visibility',
    name: 'AI Visibility',
    icon: '🤖',
    badge: 'Brand Radar',
    badgeColor: '#7abaff',
    desc: 'Track what ChatGPT, Gemini, and Perplexity say about your brands.',
    fields: [
      { id: 'brand_query', label: 'Brand or topic to check', type: 'text', placeholder: "e.g. crypto casino, no KYC gambling, Kiki's Casino…" },
      { id: 'ai_source', label: 'AI platform', type: 'select', options: ['chatgpt', 'gemini', 'perplexity', 'google_ai_overviews'], labels: ['ChatGPT', 'Gemini', 'Perplexity', 'Google AI Overviews'] },
      { id: 'competitors', label: 'Competitor brands to compare', type: 'text', placeholder: 'e.g. Stake, Rollbit, BC.Game… (optional)' },
    ],
  },
];

export const CRM_TOOLS: Tool[] = [
  {
    id: 'segment_builder',
    name: 'Segment Builder',
    icon: '👥',
    campaignLabel: 'Player segment',
    communityLabel: 'Audience segment',
    desc: 'Define player cohorts — psychology, trigger logic, offer sensitivity, and channel fit.',
    fields: [
      { id: 'segment_type', label: 'Segment type', type: 'select', options: ['New registrant (pre-deposit)', 'First depositor (FD0–7 days)', 'Early active (days 8–30)', 'Engaged player (regular depositor)', 'At-risk (10–20 days no activity)', 'Lapsed (21–60 days)', 'Dormant (60–90 days)', 'VIP / high-value', 'Bonus hunter', 'Reactivated player', 'Custom segment'] },
      { id: 'criteria', label: 'Specific criteria', type: 'text', placeholder: 'e.g. Deposited once under $50, crypto wallet only, no second session…' },
      { id: 'objective', label: 'Objective for this segment', type: 'text', placeholder: 'e.g. Convert to 2nd deposit, prevent churn, identify VIP candidates…' },
    ],
  },
  {
    id: 'lifecycle_mapper',
    name: 'Lifecycle Mapper',
    icon: '🗺️',
    campaignLabel: 'Player lifecycle',
    communityLabel: 'Community journey',
    desc: 'Map the complete player journey — stage by stage, with touchpoints, mindset, and offer fit.',
    fields: [
      { id: 'focus_stage', label: 'Focus area', type: 'select', options: ['Full lifecycle (all stages)', 'Acquisition → First deposit', 'Early activation (first 30 days)', 'Engagement & retention (ongoing)', 'At-risk → Reactivation', 'VIP journey'] },
      { id: 'market', label: 'Primary market', type: 'text', placeholder: 'e.g. UK crypto players, global anonymous gamblers, Gen-Z fantasy fans…' },
      { id: 'notes', label: 'Context / constraints', type: 'text', placeholder: 'e.g. Crypto-only, no KYC, prelaunch stage… (optional)' },
    ],
  },
  {
    id: 'bonus_designer',
    name: 'Bonus Designer',
    icon: '🎁',
    campaignLabel: 'Bonus mechanics',
    communityLabel: 'Engagement hook',
    desc: 'Design the actual offer — mechanics, structure, wagering, and segment fit.',
    fields: [
      { id: 'objective', label: 'Bonus objective', type: 'select', options: ['Convert registrant to first deposit', 'Activate player past 2nd deposit threshold', 'Reward and retain an active player', 'Reactivate lapsed player (21–60 days)', 'Reactivate dormant player (60+ days)', 'Elevate player to VIP tier', 'Seasonal or event-based offer', 'Combat specific bonus hunter behaviour'] },
      { id: 'segment', label: 'Target segment', type: 'text', placeholder: 'e.g. First-time crypto depositors under $100, lapsed 45 days, VIP tier 2…' },
      { id: 'budget', label: 'Generosity level', type: 'select', options: ['Conservative — low cost, low risk', 'Standard — market-competitive', 'Aggressive — above market, high acquisition focus'] },
      { id: 'constraints', label: 'Constraints', type: 'text', placeholder: 'e.g. Crypto-only, no-wagering preferred, max $300… (optional)' },
    ],
  },
  {
    id: 'retention_calendar',
    name: 'Retention Calendar',
    icon: '📅',
    campaignLabel: 'Retention plan',
    communityLabel: 'Engagement calendar',
    desc: 'Build a week-by-week retention plan — segment by segment, with cadence, offer, and character touchpoints.',
    fields: [
      { id: 'horizon', label: 'Planning horizon', type: 'select', options: ['4 weeks', '8 weeks', 'Quarter (13 weeks)', 'Month-by-month overview'] },
      { id: 'segments', label: 'Segments to cover', type: 'text', placeholder: 'e.g. Active, at-risk 14d, lapsed 30d, VIP — or "all key segments"' },
      { id: 'events', label: 'Key dates / events', type: 'text', placeholder: 'e.g. Brand launch, major sporting event, bonus reset… (optional)' },
    ],
  },
];

export const CRM_KNOWLEDGE = `IGAMING CRM EXPERTISE:
- FTD to 2nd deposit: 72-hour window critical; 7-day outer limit.
- Crypto churn signals: >14 days no session; session frequency declining >50% WoW; withdrawal immediately after bonus clearing.
- Player value: top 10% of depositors drive 60–70% of GGR. VIP ID within first 30 days essential.
- Reactivation rates: 30-day lapsed ≈15–20%; 60-day ≈8–10%; 90-day+ ≈3–5%.
- Bonus wagering (crypto): 20–30x player-friendly; 35–40x standard; 50x+ red flag.
- Character-led messaging: 25–40% higher open rates vs. generic casino comms.
- Crypto-native psychology: values anonymity, speed of withdrawal, no-KYC above all.
- Retention vs. acquisition cost: 5–7x more to acquire than retain.
- Lifecycle cadence: welcome (0–7d), early activation (7–30d), engagement (ongoing), at-risk (day 14), reactivation (day 30+).`;
