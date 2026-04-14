export interface Brand {
  id: string;
  name: string;
  short: string;
  url: string | null;
  stage: string;
  mode: 'campaign' | 'community';
  character: string;
  tagline: string;
  accent: string;
  channels: string[];
  payment: string;
  framework: string;
  canon: string;
}

export const BRANDS: Record<string, Brand> = {
  kikis: {
    id: 'kikis',
    name: "Kiki's Casino",
    short: "Kiki's",
    url: null,
    stage: 'Prelaunch',
    mode: 'campaign',
    character: 'Kiki',
    tagline: 'The House Is Back',
    accent: '#c9a84c',
    channels: ['TikTok', 'X'],
    payment: 'Crypto-forward',
    framework: '"The House Is Back" — four-phase prelaunch organic campaign',
    canon: `KIKI'S CASINO — CHARACTER CANON

Character: Kiki is an AI-generated 1950s–60s Las Vegas casino owner brought to life via Google Veo and Imagen. Glamorous, sharp, effortlessly confident. She ran the most interesting house on the strip — and now she's back.

Voice: Warm but never desperate. Confident without arrogance. Vintage Vegas elegance with a digital-era edge. She addresses players as "darling." Never breaks character.

World: Crypto era's answer to old Vegas. Vintage glamour meets blockchain. Campaign framework: "The House Is Back."

Voice rules: Never corporate. Never boring. Wit over hype. Glamour over grind.`,
  },
  throne: {
    id: 'throne',
    name: 'Throne of Fortune',
    short: 'Throne',
    url: 'throneoffortune.com',
    stage: 'Pre-launch',
    mode: 'campaign',
    character: 'The Ruler (TBD)',
    tagline: 'Claim What Is Yours',
    accent: '#a0192f',
    channels: ['TBD'],
    payment: 'Fiat + Crypto',
    framework: 'World-building first — lore before product',
    canon: `THRONE OF FORTUNE — BRAND CANON

Brand: GOT-adjacent fantasy casino universe. Targets younger Millennials and late Gen-Z who are fantasy-literate, crypto-adjacent, want a world not just a product.

World: Not just a casino — a living universe. Players are subjects, challengers, rulers-in-waiting. The casino is the arena. Empires begin here.

Voice rules: Grand, lore-driven, immersive. Never mundane. Never generic casino language. The player is always on a quest.`,
  },
  orions: {
    id: 'orions',
    name: "Orion's Fortune",
    short: "Orion's",
    url: 'orionsfortune.casino',
    stage: 'Pre-launch',
    mode: 'campaign',
    character: 'Orion',
    tagline: 'The anonymity. The freedom.',
    accent: '#3d8bcd',
    channels: ['X', 'Telegram'],
    payment: 'Fully crypto-native',
    framework: 'Sovereign player — intelligence and anonymity over luck',
    canon: `ORION'S FORTUNE — CHARACTER CANON

Character: Orion built this casino because she missed the freedom of cash in hand, no questions, no ceiling, no one knowing your name. She approaches the table the way she approaches the market — with preparation, pattern recognition, confidence from understanding the odds.

Brand: Fully crypto-native casino for a specific kind of player. Anonymity. No ceiling. No questions.

Voice: Quiet authority. Confident, understated, intelligent. No hype. No casino clichés. She speaks to equals.`,
  },
  chur: {
    id: 'chur',
    name: 'CHUR.BET',
    short: 'CHUR',
    url: null,
    stage: 'Experimental',
    mode: 'community',
    character: 'The Community',
    tagline: 'For players, by players',
    accent: '#6b8f71',
    channels: ['Blog', 'Discord'],
    payment: 'Brand-agnostic',
    framework: 'Community-first content dark funnel',
    canon: `CHUR.BET — COMMUNITY CANON

Platform: Brand-agnostic gambling community — for players, by players. All content reads as authentic player-generated editorial.

Purpose: Community-first content that subtly promotes Respin portfolio brands without breaking authenticity. The community's trust is the asset.

Voice: Peer-to-peer. Opinionated. Player-first. No corporate language. Smart, experienced, not afraid of an opinion.`,
  },
};

export const BRAND_IDS = Object.keys(BRANDS);

export function getBrandAccent(brandShort: string): string {
  const brand = Object.values(BRANDS).find((b) => b.short === brandShort);
  return brand?.accent || '#6b8f71';
}
