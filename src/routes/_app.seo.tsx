import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useBrand } from '@/context/BrandContext';
import { ToolCard } from '@/components/ToolCard';
import { INTEL_TOOLS, type Tool, type ToolField } from '@/data/tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/_app/seo')({
  component: SeoPage,
});

function SeoPage() {
  const { brand } = useBrand();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');

  const handleBack = () => {
    setSelectedTool(null);
    setInputs({});
    setOutput('');
  };

  const handleGenerate = () => {
    setOutput(`## SEO Analysis\n\nAhrefs integration will be connected in the next phase.\n\n---\n\nTool: ${selectedTool?.name}\nBrand: ${brand.name}\n\n${Object.entries(inputs).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`);
  };

  if (selectedTool) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to SEO tools
        </button>

        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedTool.icon}</span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{selectedTool.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedTool.desc}</p>
          </div>
          {selectedTool.badge && (
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary ml-auto">
              {selectedTool.badge}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Configure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTool.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
                  {field.type === 'select' ? (
                    <Select value={inputs[field.id] || ''} onValueChange={(v) => setInputs((p) => ({ ...p, [field.id]: v }))}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt, i) => (
                          <SelectItem key={opt} value={opt}>{field.labels?.[i] || opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={inputs[field.id] || ''} onChange={(e) => setInputs((p) => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="bg-background/50" />
                  )}
                </div>
              ))}
              <Button onClick={handleGenerate} className="w-full mt-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Results</CardTitle>
                {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>}
              </div>
            </CardHeader>
            <CardContent>
              {output ? (
                <div className="space-y-1">
                  {output.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h3 key={i} className="text-xs font-semibold uppercase tracking-wider text-primary mt-4 mb-2 border-b border-primary/20 pb-1">{line.slice(3)}</h3>;
                    if (line.startsWith('- ')) return <div key={i} className="flex gap-2 text-sm mb-1"><span className="text-primary">—</span><span>{line.slice(2)}</span></div>;
                    if (line === '---') return <hr key={i} className="border-border/30 my-3" />;
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-foreground/90 leading-relaxed">{line}</p>;
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-sm text-muted-foreground/60">Results will appear here</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SEO Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Ahrefs-powered keyword research, competitor analysis & SERP intelligence — {brand.name}</p>
      </div>

      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Intelligence Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INTEL_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => { setSelectedTool(tool); setInputs({}); setOutput(''); }} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Google Search Console', icon: '🔍', desc: 'Live indexing, impressions, and click data' },
            { name: 'GA4 Integration', icon: '📊', desc: 'Traffic analytics and conversion tracking' },
            { name: 'Site Health', icon: '🏥', desc: 'Technical SEO audit and crawl analysis' },
          ].map((item) => (
            <Card key={item.name} className="border-border/30 bg-card/20 opacity-60">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                      <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">Soon</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
