import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, User, AlertTriangle, CheckCircle2, Clock, Link2, Loader2 } from 'lucide-react';
import { CampaignStatusStepper } from '@/components/CampaignStatusStepper';
import { getCampaign, updateCampaignStatus, updateTask, createApproval, updateApproval } from '@/utils/data.functions';
import { BRANDS } from '@/data/brands';

export const Route = createFileRoute('/_app/campaigns/$campaignId')({
  component: CampaignDetailPage,
});

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-400', high: 'text-orange-400', medium: 'text-yellow-400', low: 'text-muted-foreground',
};

const STATUS_VARIANTS: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  todo: 'outline', in_progress: 'default', in_review: 'secondary', blocked: 'destructive', done: 'outline',
};

const HANDOFF_LABELS: Record<string, string> = {
  not_started: 'Not Started', ready_for_handoff: 'Ready for Handoff', handed_off: 'Handed Off', accepted: 'Accepted',
};

function CampaignDetailPage() {
  const { campaignId } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  const getCampaignFn = useServerFn(getCampaign);
  const updateStatusFn = useServerFn(updateCampaignStatus);
  const updateTaskFn = useServerFn(updateTask);
  const createApprovalFn = useServerFn(createApproval);
  const updateApprovalFn = useServerFn(updateApproval);

  const load = async () => {
    setLoading(true);
    try {
      const result = await getCampaignFn({ data: { id: campaignId } });
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [campaignId]);

  if (loading) {
    return (
      <div className="p-5 md:p-8 max-w-6xl mx-auto flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.campaign) {
    return (
      <div className="p-5 md:p-8 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Link to="/campaigns" className="text-primary text-[13px] mt-2 inline-block">← Back to campaigns</Link>
      </div>
    );
  }

  const { campaign, owner, tasks, contentBriefs, crmJourneys, seoBriefs, approvals } = data;
  const brandData = BRANDS[campaign.brand_id];

  const handleAdvanceStatus = async (nextStatus: string) => {
    setAdvancing(true);
    try {
      await updateStatusFn({ data: { id: campaign.id, status: nextStatus as any } });
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setAdvancing(false);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    await updateTaskFn({ data: { id: taskId, status: newStatus as any } });
    await load();
  };

  const handleApprovalAction = async (approvalId: string, status: string, comment?: string) => {
    await updateApprovalFn({ data: { id: approvalId, status: status as any, comment } });
    await load();
  };

  const handleRequestApproval = async (approvableId: string, approvableType: string) => {
    await createApprovalFn({ data: { approvable_id: approvableId, approvable_type: approvableType as any } });
    await load();
  };

  // Group tasks by workflow_type
  const tasksByType: Record<string, any[]> = { content: [], crm: [], seo: [], general: [] };
  for (const t of tasks) {
    const key = t.workflow_type || 'general';
    if (!tasksByType[key]) tasksByType[key] = [];
    tasksByType[key].push(t);
  }

  const tasksTotal = tasks.length;
  const tasksDone = tasks.filter((t: any) => t.status === 'done').length;

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Back link */}
      <Link to="/campaigns" className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-premium">
        <ArrowLeft className="h-4 w-4" /> Back to campaigns
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {brandData && (
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: brandData.accent }} />
            )}
            <div>
              <h1 className="text-page-title text-foreground">{campaign.name}</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {brandData?.name} · {tasksTotal > 0 ? `${tasksDone}/${tasksTotal} tasks done` : 'No tasks'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            {owner && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {owner.full_name}
              </span>
            )}
            {campaign.start_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {campaign.start_date}{campaign.end_date ? ` → ${campaign.end_date}` : ''}
              </span>
            )}
          </div>
        </div>

        <CampaignStatusStepper
          status={campaign.status}
          onAdvance={advancing ? undefined : handleAdvanceStatus}
        />
      </div>

      {/* Strategy Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-metadata text-muted-foreground">Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StrategyField label="Objective" value={campaign.objective} />
            <StrategyField label="Audience" value={campaign.audience} />
            <StrategyField label="Offer / Angle" value={campaign.offer_angle} />
            <StrategyField label="Channels" value={campaign.channels?.join(', ')} />
            <StrategyField label="Content Pillars" value={campaign.content_pillars?.join(', ')} />
            <StrategyField label="CRM Segments" value={campaign.crm_segments?.join(', ')} />
            <StrategyField label="SEO Targets" value={campaign.seo_targets?.join(', ')} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tasks">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="tasks">Tasks ({tasksTotal})</TabsTrigger>
          <TabsTrigger value="content">Content ({contentBriefs.length})</TabsTrigger>
          <TabsTrigger value="crm">CRM ({crmJourneys.length})</TabsTrigger>
          <TabsTrigger value="seo">SEO ({seoBriefs.length})</TabsTrigger>
          <TabsTrigger value="approvals">Approvals ({approvals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TasksPanel tasksByType={tasksByType} allTasks={tasks} onStatusChange={handleTaskStatusChange} />
        </TabsContent>

        <TabsContent value="content">
          <BriefsPanel items={contentBriefs} type="content_brief" onRequestApproval={handleRequestApproval} />
        </TabsContent>

        <TabsContent value="crm">
          <BriefsPanel items={crmJourneys} type="crm_journey" onRequestApproval={handleRequestApproval} />
        </TabsContent>

        <TabsContent value="seo">
          <BriefsPanel items={seoBriefs} type="seo" />
        </TabsContent>

        <TabsContent value="approvals">
          <ApprovalsPanel approvals={approvals} onAction={handleApprovalAction} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StrategyField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-[13px] text-foreground">{value || '—'}</p>
    </div>
  );
}

function TasksPanel({ tasksByType, allTasks, onStatusChange }: { tasksByType: Record<string, any[]>; allTasks: any[]; onStatusChange: (id: string, status: string) => void }) {
  const typeLabels: Record<string, string> = { content: 'Content', crm: 'CRM', seo: 'SEO', general: 'General' };

  return (
    <div className="space-y-4 mt-4">
      {Object.entries(tasksByType).map(([type, tasks]) => {
        if (tasks.length === 0) return null;
        return (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-metadata text-muted-foreground">{typeLabels[type] || type} Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.map((task: any) => {
                const depTask = task.depends_on_task_id
                  ? allTasks.find((t: any) => t.id === task.depends_on_task_id)
                  : null;
                const isBlocked = depTask && depTask.status !== 'done';

                return (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-accent/40 border border-border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-semibold ${PRIORITY_COLORS[task.priority] || ''}`}>
                          {task.priority?.toUpperCase()}
                        </span>
                        <span className="text-[13px] font-medium text-foreground">{task.title}</span>
                        <Badge variant={STATUS_VARIANTS[task.status] || 'outline'} className="text-[10px]">
                          {task.status?.replace('_', ' ')}
                        </Badge>
                        {task.handoff_status && task.handoff_status !== 'not_started' && (
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                            {HANDOFF_LABELS[task.handoff_status]}
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-[12px] text-muted-foreground mt-1">{task.description}</p>
                      )}
                      {isBlocked && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-orange-400">
                          <Link2 className="h-3 w-3" />
                          Blocked by: {depTask.title}
                        </div>
                      )}
                      {task.blocker_note && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          {task.blocker_note}
                        </div>
                      )}
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Due: {task.due_date}
                        </div>
                      )}
                    </div>
                    <Select value={task.status} onValueChange={(v) => onStatusChange(task.id, v)}>
                      <SelectTrigger className="w-[120px] h-8 text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['todo', 'in_progress', 'in_review', 'blocked', 'done'].map((s) => (
                          <SelectItem key={s} value={s} className="text-[11px]">{s.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
      {allTasks.length === 0 && (
        <p className="text-center text-[13px] text-muted-foreground py-8">No tasks yet for this campaign.</p>
      )}
    </div>
  );
}

function BriefsPanel({ items, type, onRequestApproval }: { items: any[]; type: string; onRequestApproval?: (id: string, type: string) => void }) {
  if (items.length === 0) {
    return <p className="text-center text-[13px] text-muted-foreground py-8 mt-4">No {type.replace('_', ' ')}s linked to this campaign.</p>;
  }

  return (
    <div className="space-y-2 mt-4">
      {items.map((item: any) => (
        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-accent/40 border border-border">
          <div>
            <p className="text-[13px] font-medium text-foreground">{item.title || item.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">{item.status?.replace('_', ' ')}</Badge>
              {item.platform && <span className="text-[11px] text-muted-foreground">{item.platform}</span>}
              {item.segment && <span className="text-[11px] text-muted-foreground">{item.segment}</span>}
              {item.keyword_cluster && <span className="text-[11px] text-muted-foreground">{item.keyword_cluster}</span>}
            </div>
          </div>
          {onRequestApproval && (
            <Button variant="outline" size="sm" className="text-[11px]" onClick={() => onRequestApproval(item.id, type)}>
              Request Approval
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

function ApprovalsPanel({ approvals, onAction }: { approvals: any[]; onAction: (id: string, status: string, comment?: string) => void }) {
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  if (approvals.length === 0) {
    return <p className="text-center text-[13px] text-muted-foreground py-8 mt-4">No approval requests yet.</p>;
  }

  return (
    <div className="space-y-3 mt-4">
      {approvals.map((a: any) => (
        <Card key={a.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === 'approved' ? 'default' : a.status === 'rejected' ? 'destructive' : 'outline'} className="text-[10px]">
                    {a.status}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{a.approvable_type?.replace('_', ' ')}</span>
                </div>
                {a.comment && <p className="text-[12px] text-muted-foreground mt-1">{a.comment}</p>}
              </div>
              {a.status === 'pending' && (
                <div className="flex flex-col gap-2 shrink-0">
                  <Textarea
                    value={commentMap[a.id] || ''}
                    onChange={(e) => setCommentMap((p) => ({ ...p, [a.id]: e.target.value }))}
                    placeholder="Add comment…"
                    className="h-16 w-48 text-[11px]"
                  />
                  <div className="flex gap-1.5">
                    <Button size="sm" className="text-[10px] flex-1" onClick={() => onAction(a.id, 'approved', commentMap[a.id])}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="text-[10px] flex-1" onClick={() => onAction(a.id, 'rejected', commentMap[a.id])}>
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" className="text-[10px]" onClick={() => onAction(a.id, 'changes_requested', commentMap[a.id])}>
                      Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
