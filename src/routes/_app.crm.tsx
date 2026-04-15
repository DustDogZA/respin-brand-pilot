import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useBrand } from '@/context/BrandContext';
import { useActivityLog } from '@/context/ActivityLogContext';
import { ToolCard } from '@/components/ToolCard';
import { CRM_TOOLS, type Tool } from '@/data/tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Sparkles, Loader2 } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { generateContent } from '@/utils/ai.functions';
import { buildCrmPrompt } from '@/utils/prompts';

export const Route = createFileRoute('/_app/crm')({
  component: CrmPage,
});

function CrmPage() {
  const { brand } = useBrand();
  const { addEntry } = useActivityLog();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFn = useServerFn(generateContent);

  const handleBack = () => { setSelectedTool(null); setInputs({}); setOutput(''); };

  const handleGenerate = async () => {
    if (!selectedTool) return;
    setLoading(true);
    setOutput('');
    try {
      const { system, user } = buildCrmPrompt(brand, selectedTool, inputs);
      const result = await generateFn({
        data: { systemPrompt: system, userPrompt: user, maxTokens: 1800 },
      });
      setOutput(result.text);
      if (result.text && !result.text.startsWith('Something went wrong')) {
        addEntry({ brand: brand.short, toolName: selectedTool.name, type: 'crm', fullOutput: result.text });
      }
    } catch (e) {
      setOutput(`Something went wrong: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (selectedTool) {
    return (
      <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-premium bg-transparent border-none cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Back to CRM tools
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedTool.icon}</span>
          <div>
            <h1 className="text-[18px] font-semibold tracking-[-0.02em]">{selectedTool.name}</h1>
            <p className="text-[13px] text-muted-foreground">{selectedTool.desc}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-metadata text-muted-foreground">Configure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTool.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">{field.label}</label>
                  {field.type === 'select' ? (
                    <Select value={inputs[field.id] || ''} onValueChange={(v) => setInputs((p) => ({ ...p, [field.id]: v }))}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={inputs[field.id] || ''} onChange={(e) => setInputs((p) => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} />
                  )}
                </div>
              ))}
              <Button onClick={handleGenerate} className="w-full mt-2" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate</>}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-metadata text-muted-foreground">Output</CardTitle>
                {output && !loading && <button onClick={() => navigator.clipboard.writeText(output)} className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"><Copy className="h-4 w-4" /></button>}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48 text-[13px] text-muted-foreground"><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Working…</div>
              ) : output ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[13px] text-foreground/90 leading-relaxed">{output}</div>
              ) : (
                <div className="flex items-center justify-center h-48 text-[13px] text-muted-foreground">Output will appear here</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero page="crm" />
      <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-metadata text-muted-foreground">iGaming CRM Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'FTD → 2nd Deposit', value: '72h critical window' },
                { label: 'Churn Signal', value: '>14 days no session' },
                { label: 'VIP ID Window', value: 'First 30 days' },
                { label: 'Reactivation (30d)', value: '15–20% success' },
                { label: 'Character Comms', value: '+25–40% open rate' },
                { label: 'Retention ROI', value: '5–7x vs acquisition' },
              ].map((metric) => (
                <div key={metric.label} className="p-3 rounded-xl bg-accent/60 border border-border">
                  <p className="text-metadata text-muted-foreground">{metric.label}</p>
                  <p className="text-[13px] font-medium text-foreground mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div>
          <h2 className="text-metadata text-muted-foreground mb-3">CRM Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CRM_TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={() => { setSelectedTool(tool); setInputs({}); setOutput(''); }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
