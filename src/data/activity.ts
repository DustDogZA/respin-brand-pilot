export interface ActivityEntry {
  brand: string;
  type: 'acq' | 'ret' | 'lore' | 'intel' | 'content' | 'crm';
  text: string;
  time: string;
}

export const SEED_ACTIVITY: ActivityEntry[] = [];

export const TYPE_LABELS: Record<string, string> = {
  acq: 'Acquisition',
  ret: 'Retention',
  lore: 'Lore',
  intel: 'Intel',
  content: 'Content',
  crm: 'CRM',
};

export const CAMPAIGN_CALENDAR: { brand: string; activity: string; type: string; period: string; status: string }[] = [];
