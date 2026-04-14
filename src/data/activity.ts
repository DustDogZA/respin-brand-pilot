export interface ActivityEntry {
  brand: string;
  type: 'acq' | 'ret' | 'lore' | 'intel' | 'content' | 'crm';
  text: string;
  time: string;
}

export const SEED_ACTIVITY: ActivityEntry[] = [
  { brand: "Kiki's", type: 'acq', text: 'TikTok character post — "The House Always Wins, Darling"', time: '2h ago' },
  { brand: "Orion's", type: 'crm', text: 'Segment Builder — crypto depositor at-risk 14 days', time: '3h ago' },
  { brand: 'Throne', type: 'lore', text: 'Lore drop — origins of the Throne', time: '1d ago' },
  { brand: 'CHUR', type: 'content', text: 'Player article — crypto casino comparison 2025', time: '1d ago' },
  { brand: "Kiki's", type: 'crm', text: 'Bonus Designer — FTD conversion offer, aggressive', time: '2d ago' },
  { brand: "Orion's", type: 'intel', text: 'Keyword Compass — no KYC casino UK', time: '2d ago' },
  { brand: 'Throne', type: 'crm', text: 'Retention Calendar — Q2 eight-week plan', time: '3d ago' },
  { brand: 'CHUR', type: 'content', text: 'Hot take — why provably fair casinos matter', time: '3d ago' },
  { brand: "Orion's", type: 'ret', text: 'Lifecycle message — VIP reactivation', time: '4d ago' },
  { brand: "Kiki's", type: 'crm', text: 'Lifecycle Mapper — early activation 30-day focus', time: '4d ago' },
];

export const TYPE_LABELS: Record<string, string> = {
  acq: 'Acquisition',
  ret: 'Retention',
  lore: 'Lore',
  intel: 'Intel',
  content: 'Content',
  crm: 'CRM',
};

export const CAMPAIGN_CALENDAR = [
  { brand: "Kiki's", activity: 'Phase 1 — Teaser', type: 'acq', period: 'Apr 14 – Apr 28', status: 'Active' },
  { brand: 'Throne', activity: 'Lore campaign — Origins', type: 'lore', period: 'Apr 14 – May 12', status: 'Planning' },
  { brand: "Orion's", activity: 'X / Telegram launch', type: 'acq', period: 'Apr 21 – May 5', status: 'Upcoming' },
  { brand: 'CHUR', activity: 'Editorial calendar — Week 1', type: 'content', period: 'Apr 14 – Apr 21', status: 'Active' },
  { brand: "Kiki's", activity: 'Crypto FTD welcome flow', type: 'crm', period: 'Apr 21 – May 19', status: 'Planning' },
  { brand: "Orion's", activity: 'SEO content sprint', type: 'intel', period: 'Apr 28 – May 26', status: 'Planning' },
];
