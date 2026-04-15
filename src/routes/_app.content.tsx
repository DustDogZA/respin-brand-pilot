import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useBrand } from '@/context/BrandContext';
import { useActivityLog } from '@/context/ActivityLogContext';
import { ToolCard } from '@/components/ToolCard';
import { CAMPAIGN_TOOLS, COMMUNITY_TOOLS, type Tool, type ToolField } from '@/data/tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Sparkles, Loader2 } from 'lucide-react';
import { generateContent } from '@/utils/ai.functions';
import { buildContentPrompt } from '@/utils/prompts';

export const Route = createFileRoute('/_app/content')({
  component: ContentPage,
});

function ContentPage() {
  const { brand } = useBrand();
  const { addEntry } = useActivityLog();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFn = useServerFn(generateContent);

  const tools = brand.mode === 'campaign' ? CAMPAIGN_TOOLS : COMMUNITY_TOOLS;

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setInputs({});
    setOutput('');
  };

  const handleBack = () => {
    setSelectedTool(null);
    setInputs({});
    setOutput('');
  };

  const handleGenerate = async () => {
    if (!selectedTool) return;
    setLoading(true);
    setOutput('');
    try {
      const { system, user } = buildContentPrompt(brand, selectedTool, inputs);
      const result = await generateFn({
        data: { systemPrompt: system, userPrompt: user, maxTokens: 1200 },
      });
      setOutput(result.text);
      if (result.text && !result.text.startsWith('Something went wrong')) {
        addEntry({
          brand: brand.short,
          toolName: selectedTool.name,
          type: 'content',
          fullOutput: result.text,
        });
      }
    } catch (e) {
      setOutput(`Something went wrong: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (selectedTool) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tools
        </button>

        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedTool.icon}</span>
          <div>
            <h1 className="text-xl font-extrabold tracking-[-0.03em] text-foreground">
              {selectedTool.name}
            </h1>
            <p className="text-[13px] text-muted-foreground">{selectedTool.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Configure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTool.fields.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={inputs[field.id] || ''}
                  onChange={(v) => setInputs((prev) => ({ ...prev, [field.id]: v }))}
                />
              ))}
              <Button
                onClick={handleGenerate}
                className="w-full mt-2"
                disabled={Object.keys(inputs).length === 0 || loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Generate</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Output
                </CardTitle>
                {output && !loading && (
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48 text-[13px] text-muted-foreground/60">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Working…
                </div>
              ) : output ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[13px] text-foreground/90 leading-relaxed">
                  {output}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-[13px] text-muted-foreground/60">
                  Output will appear here
                </div>
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
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-foreground">
          Content Studio
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {brand.mode === 'campaign' ? 'Campaign & character content tools' : 'Community content tools'} — {brand.name}
        </p>
      </div>

      {brand.mode === 'campaign' && (
        <>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3 flex items-center gap-2">
              Campaign Tools
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{brand.short}</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAMPAIGN_TOOLS.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={() => handleToolSelect(tool)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
              Community Tools (CHUR.BET)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {COMMUNITY_TOOLS.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={() => handleToolSelect(tool)} />
              ))}
            </div>
          </div>
        </>
      )}

      {brand.mode === 'community' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMUNITY_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => handleToolSelect(tool)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ToolField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-muted-foreground">{field.label}</label>
      {field.type === 'select' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-background/50 rounded-full">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt, i) => (
              <SelectItem key={opt} value={opt}>
                {field.labels?.[i] || opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="bg-background/50 min-h-[100px]"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="bg-background/50 rounded-full"
        />
      )}
    </div>
  );
}
