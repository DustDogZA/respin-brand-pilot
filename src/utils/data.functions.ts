import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';

type CampaignStatus = Database['public']['Enums']['campaign_status'];
type TaskStatus = Database['public']['Enums']['task_status'];
type TaskPriority = Database['public']['Enums']['task_priority'];
type WorkflowType = Database['public']['Enums']['workflow_type'];

// =============================================
// BRANDS
// =============================================

export const listBrands = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from('brands')
      .select('*')
      .order('created_at');
    if (error) throw new Error(error.message);
    return { brands: data || [] };
  });

// =============================================
// CAMPAIGNS
// =============================================

export const listCampaigns = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string; status?: CampaignStatus }) => input)
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from('campaigns')
      .select('*')
      .order('updated_at', { ascending: false });
    if (data.brandId) query = query.eq('brand_id', data.brandId);
    if (data.status) query = query.eq('status', data.status);
    const { data: campaigns, error } = await query;
    if (error) throw new Error(error.message);
    return { campaigns: campaigns || [] };
  });

export const getCampaign = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: campaign, error } = await context.supabase
      .from('campaigns')
      .select('*')
      .eq('id', data.id)
      .single();
    if (error) throw new Error(error.message);

    const [tasksRes, briefsRes, journeysRes, seoRes, approvalsRes] = await Promise.all([
      context.supabase.from('tasks').select('*').eq('campaign_id', data.id).order('priority'),
      context.supabase.from('content_briefs').select('*').eq('campaign_id', data.id),
      context.supabase.from('crm_journeys').select('*').eq('campaign_id', data.id),
      context.supabase.from('seo_briefs').select('*').eq('campaign_id', data.id),
      context.supabase.from('approvals').select('*').eq('approvable_id', data.id),
    ]);

    return {
      campaign,
      tasks: tasksRes.data || [],
      contentBriefs: briefsRes.data || [],
      crmJourneys: journeysRes.data || [],
      seoBriefs: seoRes.data || [],
      approvals: approvalsRes.data || [],
    };
  });

export const createCampaign = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    brand_id: string; name: string; objective?: string; audience?: string;
    offer_angle?: string; channels?: string[]; status?: CampaignStatus;
    start_date?: string; end_date?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    const insertData = { ...data, owner_id: context.userId };
    const { data: campaign, error } = await context.supabase
      .from('campaigns')
      .insert([insertData] as any)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { campaign };
  });

export const updateCampaignStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: CampaignStatus }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from('campaigns')
      .update({ status: data.status })
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// =============================================
// TASKS
// =============================================

export const listTasks = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string; campaignId?: string; status?: TaskStatus; workflowType?: WorkflowType }) => input)
  .handler(async ({ data, context }) => {
    let query = context.supabase.from('tasks').select('*').order('priority').order('due_date', { ascending: true, nullsFirst: false });
    if (data.brandId) query = query.eq('brand_id', data.brandId);
    if (data.campaignId) query = query.eq('campaign_id', data.campaignId);
    if (data.status) query = query.eq('status', data.status);
    if (data.workflowType) query = query.eq('workflow_type', data.workflowType);
    const { data: tasks, error } = await query;
    if (error) throw new Error(error.message);
    return { tasks: tasks || [] };
  });

export const createTask = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    brand_id: string; title: string; campaign_id?: string; description?: string;
    priority?: TaskPriority; workflow_type?: WorkflowType; due_date?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    const insertData = { ...data, assignee_id: context.userId };
    const { data: task, error } = await context.supabase
      .from('tasks')
      .insert([insertData] as any)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { task };
  });

export const updateTaskStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: TaskStatus }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from('tasks')
      .update({ status: data.status })
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// =============================================
// CONTENT BRIEFS
// =============================================

export const listContentBriefs = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string; campaignId?: string }) => input)
  .handler(async ({ data, context }) => {
    let query = context.supabase.from('content_briefs').select('*').order('updated_at', { ascending: false });
    if (data.brandId) query = query.eq('brand_id', data.brandId);
    if (data.campaignId) query = query.eq('campaign_id', data.campaignId);
    const { data: briefs, error } = await query;
    if (error) throw new Error(error.message);
    return { briefs: briefs || [] };
  });

// =============================================
// CRM JOURNEYS
// =============================================

export const listCrmJourneys = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string; campaignId?: string }) => input)
  .handler(async ({ data, context }) => {
    let query = context.supabase.from('crm_journeys').select('*').order('updated_at', { ascending: false });
    if (data.brandId) query = query.eq('brand_id', data.brandId);
    if (data.campaignId) query = query.eq('campaign_id', data.campaignId);
    const { data: journeys, error } = await query;
    if (error) throw new Error(error.message);
    return { journeys: journeys || [] };
  });

// =============================================
// SEO BRIEFS
// =============================================

export const listSeoBriefs = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string; campaignId?: string }) => input)
  .handler(async ({ data, context }) => {
    let query = context.supabase.from('seo_briefs').select('*').order('updated_at', { ascending: false });
    if (data.brandId) query = query.eq('brand_id', data.brandId);
    if (data.campaignId) query = query.eq('campaign_id', data.campaignId);
    const { data: briefs, error } = await query;
    if (error) throw new Error(error.message);
    return { briefs: briefs || [] };
  });

// =============================================
// AI OUTPUTS
// =============================================

export const saveAiOutput = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    brand_id: string; tool_name: string; content: string; output_type?: string;
    campaign_id?: string; task_id?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    const { data: output, error } = await context.supabase
      .from('ai_outputs')
      .insert({
        ...data,
        preview: data.content.slice(0, 100),
        created_by: context.userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { output };
  });

export const listAiOutputs = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string; limit?: number }) => input)
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from('ai_outputs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(data.limit || 50);
    if (data.brandId) query = query.eq('brand_id', data.brandId);
    const { data: outputs, error } = await query;
    if (error) throw new Error(error.message);
    return { outputs: outputs || [] };
  });

// =============================================
// APPROVALS
// =============================================

export const listPendingApprovals = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from('approvals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return { approvals: data || [] };
  });

// =============================================
// TEAM
// =============================================

export const listTeamMembers = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profiles, error: profilesError } = await context.supabase
      .from('profiles')
      .select('*');
    if (profilesError) throw new Error(profilesError.message);

    const { data: roles, error: rolesError } = await context.supabase
      .from('user_roles')
      .select('*');
    if (rolesError) throw new Error(rolesError.message);

    const members = (profiles || []).map((p) => ({
      ...p,
      roles: (roles || []).filter((r) => r.user_id === p.id).map((r) => r.role),
    }));

    return { members };
  });

// =============================================
// PORTFOLIO STATS
// =============================================

export const getPortfolioStats = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brandId?: string }) => input)
  .handler(async ({ data, context }) => {
    const brandFilter = data.brandId && data.brandId !== 'all' ? data.brandId : null;

    let campaignsQuery = context.supabase.from('campaigns').select('id, brand_id, status, name');
    let tasksQuery = context.supabase.from('tasks').select('id, brand_id, status, priority, due_date, title, campaign_id, workflow_type, blocker_note');
    let briefsQuery = context.supabase.from('content_briefs').select('id, brand_id, status');
    let journeysQuery = context.supabase.from('crm_journeys').select('id, brand_id, status');
    let seoQuery = context.supabase.from('seo_briefs').select('id, brand_id, status');

    if (brandFilter) {
      campaignsQuery = campaignsQuery.eq('brand_id', brandFilter);
      tasksQuery = tasksQuery.eq('brand_id', brandFilter);
      briefsQuery = briefsQuery.eq('brand_id', brandFilter);
      journeysQuery = journeysQuery.eq('brand_id', brandFilter);
      seoQuery = seoQuery.eq('brand_id', brandFilter);
    }

    const [campaignsRes, tasksRes, briefsRes, journeysRes, seoRes] = await Promise.all([
      campaignsQuery, tasksQuery, briefsQuery, journeysQuery, seoQuery,
    ]);

    return {
      campaigns: campaignsRes.data || [],
      tasks: tasksRes.data || [],
      contentBriefs: briefsRes.data || [],
      crmJourneys: journeysRes.data || [],
      seoBriefs: seoRes.data || [],
    };
  });
