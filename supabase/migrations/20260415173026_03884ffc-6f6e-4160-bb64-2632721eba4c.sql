-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE public.app_role AS ENUM (
  'admin', 'head_of_marketing', 'brand_manager', 
  'content_lead', 'crm_lead', 'seo_lead', 
  'contributor', 'approver'
);

CREATE TYPE public.campaign_status AS ENUM (
  'strategy', 'planning', 'production', 'review', 'published', 'learning'
);

CREATE TYPE public.task_status AS ENUM (
  'todo', 'in_progress', 'in_review', 'blocked', 'done'
);

CREATE TYPE public.task_priority AS ENUM (
  'critical', 'high', 'medium', 'low'
);

CREATE TYPE public.workflow_type AS ENUM (
  'content', 'crm', 'seo', 'general'
);

CREATE TYPE public.content_brief_status AS ENUM (
  'idea', 'briefed', 'drafting', 'in_review', 'approved', 'scheduled', 'published', 'measured'
);

CREATE TYPE public.crm_journey_status AS ENUM (
  'segment_defined', 'journey_mapped', 'message_drafted', 'in_review', 'approved', 'sending', 'sent', 'measured'
);

CREATE TYPE public.seo_brief_status AS ENUM (
  'research', 'briefed', 'optimizing', 'in_review', 'published', 'tracking'
);

CREATE TYPE public.approval_status AS ENUM (
  'pending', 'approved', 'rejected', 'changes_requested'
);

CREATE TYPE public.approvable_type AS ENUM (
  'content_brief', 'crm_journey', 'campaign'
);

-- =============================================
-- TABLES
-- =============================================

CREATE TABLE public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short TEXT NOT NULL,
  url TEXT,
  stage TEXT NOT NULL DEFAULT 'Pre-launch',
  mode TEXT NOT NULL DEFAULT 'campaign',
  character TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  accent TEXT NOT NULL DEFAULT '#6b8f71',
  channels TEXT[] NOT NULL DEFAULT '{}',
  payment TEXT NOT NULL DEFAULT '',
  framework TEXT NOT NULL DEFAULT '',
  canon TEXT NOT NULL DEFAULT '',
  is_experiment BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT,
  audience TEXT,
  offer_angle TEXT,
  channels TEXT[] NOT NULL DEFAULT '{}',
  content_pillars TEXT[] NOT NULL DEFAULT '{}',
  seo_targets TEXT[] NOT NULL DEFAULT '{}',
  crm_segments TEXT[] NOT NULL DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.campaign_status NOT NULL DEFAULT 'strategy',
  start_date DATE,
  end_date DATE,
  linked_campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  status public.task_status NOT NULL DEFAULT 'todo',
  blocker_note TEXT,
  due_date DATE,
  workflow_type public.workflow_type NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.content_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content_type TEXT,
  platform TEXT,
  brief_text TEXT,
  draft_text TEXT,
  status public.content_brief_status NOT NULL DEFAULT 'idea',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.crm_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  segment TEXT,
  journey_type TEXT,
  message_draft TEXT,
  status public.crm_journey_status NOT NULL DEFAULT 'segment_defined',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.seo_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  keyword_cluster TEXT,
  target_page TEXT,
  brief_text TEXT,
  status public.seo_brief_status NOT NULL DEFAULT 'research',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approvable_type public.approvable_type NOT NULL,
  approvable_id UUID NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.approval_status NOT NULL DEFAULT 'pending',
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  tool_name TEXT NOT NULL,
  output_type TEXT,
  content TEXT NOT NULL,
  preview TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_campaigns_brand ON public.campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_owner ON public.campaigns(owner_id);
CREATE INDEX idx_tasks_campaign ON public.tasks(campaign_id);
CREATE INDEX idx_tasks_brand ON public.tasks(brand_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_content_briefs_campaign ON public.content_briefs(campaign_id);
CREATE INDEX idx_content_briefs_brand ON public.content_briefs(brand_id);
CREATE INDEX idx_crm_journeys_campaign ON public.crm_journeys(campaign_id);
CREATE INDEX idx_crm_journeys_brand ON public.crm_journeys(brand_id);
CREATE INDEX idx_seo_briefs_campaign ON public.seo_briefs(campaign_id);
CREATE INDEX idx_seo_briefs_brand ON public.seo_briefs(brand_id);
CREATE INDEX idx_ai_outputs_brand ON public.ai_outputs(brand_id);
CREATE INDEX idx_ai_outputs_created_by ON public.ai_outputs(created_by);
CREATE INDEX idx_approvals_approvable ON public.approvals(approvable_type, approvable_id);

-- =============================================
-- SECURITY DEFINER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_briefs_updated_at BEFORE UPDATE ON public.content_briefs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_journeys_updated_at BEFORE UPDATE ON public.crm_journeys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_briefs_updated_at BEFORE UPDATE ON public.seo_briefs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'contributor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- RLS
-- =============================================

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read brands" ON public.brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read user_roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read campaigns" ON public.campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read content_briefs" ON public.content_briefs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read crm_journeys" ON public.crm_journeys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read seo_briefs" ON public.seo_briefs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read approvals" ON public.approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read ai_outputs" ON public.ai_outputs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Leaders can insert campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing') OR public.has_role(auth.uid(), 'brand_manager')
);
CREATE POLICY "Leaders can update campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing') OR public.has_role(auth.uid(), 'brand_manager')
);
CREATE POLICY "Leaders can delete campaigns" ON public.campaigns FOR DELETE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
);

CREATE POLICY "Team can insert tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'content_lead')
  OR public.has_role(auth.uid(), 'crm_lead') OR public.has_role(auth.uid(), 'seo_lead')
  OR public.has_role(auth.uid(), 'contributor')
);
CREATE POLICY "Team can update tasks" ON public.tasks FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'content_lead')
  OR public.has_role(auth.uid(), 'crm_lead') OR public.has_role(auth.uid(), 'seo_lead')
  OR public.has_role(auth.uid(), 'contributor')
);

CREATE POLICY "Content team can insert briefs" ON public.content_briefs FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'content_lead')
  OR public.has_role(auth.uid(), 'contributor')
);
CREATE POLICY "Content team can update briefs" ON public.content_briefs FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'content_lead')
  OR public.has_role(auth.uid(), 'contributor')
);

CREATE POLICY "CRM team can insert journeys" ON public.crm_journeys FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'crm_lead')
  OR public.has_role(auth.uid(), 'contributor')
);
CREATE POLICY "CRM team can update journeys" ON public.crm_journeys FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'crm_lead')
  OR public.has_role(auth.uid(), 'contributor')
);

CREATE POLICY "SEO team can insert briefs" ON public.seo_briefs FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'seo_lead')
  OR public.has_role(auth.uid(), 'contributor')
);
CREATE POLICY "SEO team can update briefs" ON public.seo_briefs FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing')
  OR public.has_role(auth.uid(), 'brand_manager') OR public.has_role(auth.uid(), 'seo_lead')
  OR public.has_role(auth.uid(), 'contributor')
);

CREATE POLICY "Reviewers can insert approvals" ON public.approvals FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing') OR public.has_role(auth.uid(), 'approver')
);
CREATE POLICY "Reviewers can update approvals" ON public.approvals FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'head_of_marketing') OR public.has_role(auth.uid(), 'approver')
);

CREATE POLICY "Users can insert ai_outputs" ON public.ai_outputs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- SEED DATA: Brands
-- =============================================

INSERT INTO public.brands (id, name, short, url, stage, mode, character, tagline, accent, channels, payment, framework, canon, is_experiment) VALUES
('kikis', 'Kiki''s Casino', 'Kiki''s', NULL, 'Prelaunch', 'campaign', 'Kiki', 'The House Is Back', '#c9a84c', ARRAY['TikTok', 'X'], 'Crypto-forward', '"The House Is Back" — four-phase prelaunch organic campaign', 'KIKI''S CASINO — CHARACTER CANON

Character: Kiki is an AI-generated 1950s–60s Las Vegas casino owner brought to life via Google Veo and Imagen. Glamorous, sharp, effortlessly confident.

Voice: Warm but never desperate. Confident without arrogance. Vintage Vegas elegance with a digital-era edge. She addresses players as "darling." Never breaks character.

World: Crypto era''s answer to old Vegas. Vintage glamour meets blockchain.

Voice rules: Never corporate. Never boring. Wit over hype. Glamour over grind.', false),

('throne', 'Throne of Fortune', 'Throne', 'throneoffortune.com', 'Pre-launch', 'campaign', 'The Ruler (TBD)', 'Claim What Is Yours', '#a0192f', ARRAY['TBD'], 'Fiat + Crypto', 'World-building first — lore before product', 'THRONE OF FORTUNE — BRAND CANON

Brand: GOT-adjacent fantasy casino universe. Targets younger Millennials and late Gen-Z.

World: Not just a casino — a living universe. Players are subjects, challengers, rulers-in-waiting.

Voice rules: Grand, lore-driven, immersive. Never mundane. Never generic casino language.', false),

('orions', 'Orion''s Fortune', 'Orion''s', 'orionsfortune.casino', 'Pre-launch', 'campaign', 'Orion', 'The anonymity. The freedom.', '#3d8bcd', ARRAY['X', 'Telegram'], 'Fully crypto-native', 'Sovereign player — intelligence and anonymity over luck', 'ORION''S FORTUNE — CHARACTER CANON

Character: Orion built this casino because she missed the freedom of cash in hand, no questions, no ceiling.

Brand: Fully crypto-native casino for a specific kind of player. Anonymity. No ceiling. No questions.

Voice: Quiet authority. Confident, understated, intelligent. No hype. No casino clichés.', false),

('chur', 'CHUR.BET', 'CHUR', NULL, 'Experimental', 'community', 'The Community', 'For players, by players', '#6b8f71', ARRAY['Blog', 'Discord'], 'Brand-agnostic', 'Community-first content dark funnel', 'CHUR.BET — COMMUNITY CANON

Platform: Brand-agnostic gambling community — for players, by players.

Purpose: Community-first content that subtly promotes Respin portfolio brands without breaking authenticity.

Voice: Peer-to-peer. Opinionated. Player-first. No corporate language.', true);

-- =============================================
-- SEED DATA: Campaigns
-- =============================================

INSERT INTO public.campaigns (id, brand_id, name, objective, audience, offer_angle, channels, content_pillars, seo_targets, crm_segments, status, start_date, end_date) VALUES
('a1000000-0000-0000-0000-000000000001', 'kikis', 'The House Is Back — Phase 1', 'Build anticipation and character recognition before launch', 'Crypto-native 25–35, social media active', 'Character reveal, no product yet', ARRAY['TikTok', 'X'], ARRAY['Character introduction', 'Vintage Vegas aesthetic', 'Crypto culture'], ARRAY['crypto casino', 'new casino 2026'], ARRAY['Pre-registrants', 'Social followers'], 'production', '2026-04-01', '2026-05-15'),
('a1000000-0000-0000-0000-000000000002', 'kikis', 'Launch Week Blitz', 'Drive first deposits in launch week', 'Pre-registered users + crypto Twitter', 'Welcome bonus + exclusive access', ARRAY['TikTok', 'X', 'Email'], ARRAY['Launch announcement', 'Bonus reveal', 'Player testimonials'], ARRAY['crypto casino bonus', 'new crypto casino launch'], ARRAY['Pre-registrants', 'Crypto depositors'], 'planning', '2026-05-16', '2026-05-23'),
('a1000000-0000-0000-0000-000000000003', 'throne', 'World Genesis', 'Establish the Throne universe before any product marketing', 'Fantasy-literate Gen-Z and young Millennials', 'Lore and world-building, no product pitch', ARRAY['TBD'], ARRAY['Origin stories', 'Character lore', 'World rules'], ARRAY['fantasy casino', 'gaming casino'], ARRAY[]::TEXT[], 'strategy', '2026-06-01', '2026-08-01'),
('a1000000-0000-0000-0000-000000000004', 'throne', 'Ruler Character Launch', 'Introduce the central character to the community', 'Fantasy gaming community, crypto-adjacent', 'Character-first storytelling', ARRAY['TBD'], ARRAY['Character reveal', 'Interactive lore'], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'strategy', '2026-07-01', '2026-07-31'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Sovereign Player — Awareness', 'Position Orion''s as the serious crypto player''s casino', 'Experienced crypto gamblers, privacy-focused', 'Anonymity + no-ceiling positioning', ARRAY['X', 'Telegram'], ARRAY['Privacy narrative', 'Market intelligence', 'Player sovereignty'], ARRAY['anonymous casino', 'no KYC casino'], ARRAY['Crypto whales', 'Privacy-first players'], 'production', '2026-04-15', '2026-06-15'),
('a1000000-0000-0000-0000-000000000006', 'orions', 'Telegram Community Build', 'Build 5k Telegram community before launch', 'Crypto Telegram users, gambling community', 'Exclusive insights + early access', ARRAY['Telegram'], ARRAY['Market insights', 'Exclusive content'], ARRAY[]::TEXT[], ARRAY['Telegram subscribers'], 'planning', '2026-05-01', '2026-06-30'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'Editorial Voice — MVP', 'Define and test the CHUR editorial voice through 10 articles', 'Crypto gambling enthusiasts, community readers', 'Authentic player perspective, no brand bias', ARRAY['Blog', 'Discord'], ARRAY['Casino reviews', 'Strategy guides', 'Industry opinion'], ARRAY['crypto casino review', 'best crypto casinos'], ARRAY[]::TEXT[], 'production', '2026-04-01', '2026-05-31'),
('a1000000-0000-0000-0000-000000000008', 'chur', 'Discord Community Seed', 'Get first 200 engaged Discord members', 'Crypto gambling community, Reddit crossover', 'Real talk, no corporate BS', ARRAY['Discord'], ARRAY['Discussion starters', 'Hot takes', 'Player stories'], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'planning', '2026-04-15', '2026-06-15');

-- =============================================
-- SEED DATA: Tasks
-- =============================================

INSERT INTO public.tasks (campaign_id, brand_id, title, description, priority, status, due_date, workflow_type) VALUES
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Draft TikTok opener — character reveal', 'First TikTok introducing Kiki. Casino floor, midnight, champagne glass, voiceover.', 'critical', 'in_progress', '2026-04-20', 'content'),
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Complete Veo brief — opening scene', 'Detailed Veo 3 prompt for the casino floor reveal video.', 'high', 'todo', '2026-04-22', 'content'),
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Write X thread — who is Kiki?', 'Teaser thread revealing character backstory.', 'high', 'todo', '2026-04-25', 'content'),
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Define pre-registration segment', 'Build pre-registration CRM segment and welcome automation.', 'medium', 'todo', '2026-04-28', 'crm'),
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Keyword research — crypto casino terms', 'Map the keyword landscape for crypto casino terms.', 'medium', 'done', '2026-04-10', 'seo'),
('a1000000-0000-0000-0000-000000000002', 'kikis', 'Design welcome bonus structure', 'Define launch week bonus: match %, wagering, limits.', 'high', 'todo', '2026-05-01', 'crm'),
('a1000000-0000-0000-0000-000000000002', 'kikis', 'Write launch announcement — all channels', 'Launch day copy for TikTok, X, email, landing page.', 'critical', 'todo', '2026-05-10', 'content'),
('a1000000-0000-0000-0000-000000000003', 'throne', 'Name the Ruler character', 'Research and propose 3 name options with lore justification.', 'critical', 'blocked', NULL, 'content'),
('a1000000-0000-0000-0000-000000000003', 'throne', 'Write origin lore — The First Kingdom', 'Foundation lore piece establishing the Throne universe.', 'high', 'todo', '2026-06-15', 'content'),
('a1000000-0000-0000-0000-000000000003', 'throne', 'SEO gap analysis — fantasy casino niche', 'Research if fantasy casino has viable search volume.', 'medium', 'todo', '2026-06-20', 'seo'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Build at-risk crypto depositor segment', 'Define churn signals for crypto-native players.', 'critical', 'in_progress', '2026-04-25', 'crm'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Competitor intel — stake.com benchmark', 'Full competitive analysis of Stake.', 'high', 'todo', '2026-04-28', 'seo'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Write X content — sovereignty narrative', '3 posts establishing the play without permission angle.', 'high', 'in_progress', '2026-04-22', 'content'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Design Telegram welcome sequence', '5-message onboarding sequence for Telegram group.', 'medium', 'todo', '2026-05-05', 'crm'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'Write first player article', 'Crypto casino landscape overview — player perspective.', 'critical', 'in_progress', '2026-04-20', 'content'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'Define editorial voice guide', 'Document what CHUR sounds like, examples.', 'high', 'todo', '2026-04-25', 'content'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'Keyword map — gambling content terms', 'Map high-intent editorial keywords.', 'medium', 'todo', '2026-04-30', 'seo'),
('a1000000-0000-0000-0000-000000000008', 'chur', 'Set up Discord server structure', 'Channels, roles, rules, welcome flow.', 'high', 'todo', '2026-04-22', 'general'),
('a1000000-0000-0000-0000-000000000008', 'chur', 'Write 5 discussion starter posts', 'Seed content for Discord.', 'medium', 'todo', '2026-04-28', 'content');

UPDATE public.tasks SET blocker_note = 'Waiting on brand strategy alignment — character direction needs COO sign-off' WHERE title = 'Name the Ruler character';

-- =============================================
-- SEED DATA: Content Briefs
-- =============================================

INSERT INTO public.content_briefs (campaign_id, brand_id, title, content_type, platform, brief_text, status) VALUES
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Kiki character reveal — TikTok', 'Video', 'TikTok', 'Opening shot: casino floor, dim lighting, champagne glass. Voiceover introduces Kiki.', 'drafting'),
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Who is Kiki? — X thread', 'Thread', 'X', '5-part thread teasing Kiki backstory. End with pre-register CTA.', 'briefed'),
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Casino opening night — blog post', 'Blog', 'Blog', 'In-character blog post from Kiki about reopening night.', 'idea'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'The sovereign player — manifesto', 'Blog', 'Blog', 'Long-form piece defining playing without permission.', 'drafting'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Privacy in crypto gambling — X posts', 'Social', 'X', '3 posts about privacy, anonymity, player sovereignty.', 'in_review'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'Best crypto casinos 2026 — review', 'Article', 'Blog', 'Opinionated roundup. Authentic voice. Mention portfolio brands naturally.', 'drafting'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'Why I stopped playing at [competitor]', 'Article', 'Blog', 'First-person editorial about leaving mainstream for crypto.', 'idea');

-- =============================================
-- SEED DATA: CRM Journeys
-- =============================================

INSERT INTO public.crm_journeys (campaign_id, brand_id, name, segment, journey_type, message_draft, status) VALUES
('a1000000-0000-0000-0000-000000000001', 'kikis', 'Pre-registration welcome', 'Pre-registrants', 'Welcome sequence', 'Welcome to the waitlist, darling. The house is almost ready.', 'message_drafted'),
('a1000000-0000-0000-0000-000000000002', 'kikis', 'Launch week FTD push', 'Pre-registrants (no deposit)', 'Conversion', NULL, 'segment_defined'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'At-risk crypto depositor reactivation', 'At-risk (14d+ no session)', 'Reactivation', NULL, 'journey_mapped'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'Telegram to deposit funnel', 'Telegram subscribers (no deposit)', 'Conversion', NULL, 'segment_defined');

-- =============================================
-- SEED DATA: SEO Briefs
-- =============================================

INSERT INTO public.seo_briefs (campaign_id, brand_id, keyword_cluster, target_page, brief_text, status) VALUES
('a1000000-0000-0000-0000-000000000001', 'kikis', 'crypto casino, new crypto casino, bitcoin casino', 'Homepage + blog', 'Target high-volume crypto casino terms with blog content.', 'briefed'),
('a1000000-0000-0000-0000-000000000005', 'orions', 'anonymous casino, no KYC casino, crypto gambling anonymous', 'Homepage + landing pages', 'Own the anonymous casino niche with privacy-focused pages.', 'optimizing'),
('a1000000-0000-0000-0000-000000000007', 'chur', 'crypto casino review, best crypto casinos, casino comparison', 'Blog articles', 'Community-voice reviews targeting informational intent.', 'research'),
('a1000000-0000-0000-0000-000000000003', 'throne', 'fantasy casino, gaming casino, RPG casino', 'TBD', 'Research phase: validate if this niche has viable search volume.', 'research');