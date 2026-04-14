import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useBrand } from '@/context/BrandContext';
import { ToolCard } from '@/components/ToolCard';
import { CAMPAIGN_TOOLS, COMMUNITY_TOOLS, type Tool, type ToolField } from '@/data/tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/_app/content')({
  component: ContentPage,
});

function ContentPage() {
  const { brand } = useBrand();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');

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

  const handleGenerate = () => {
    setOutput(`## Generated Output\n\nAI generation will be connected in the next phase. This is a placeholder for the **${selectedTool?.name}** tool output.\n\n---\n\nBrand: ${brand.name}\nCharacter: ${brand.character}\n\nInputs provided:\n${Object.entries(inputs).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`);
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
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {selectedTool.name}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedTool.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="border-border/50 bg-card/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
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
                disabled={Object.keys(inputs).length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="border-border/50 bg-card/40">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Output
                </CardTitle>
                {output && (
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
              {output ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  {output.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h3 key={i} className="text-xs font-semibold uppercase tracking-wider text-primary mt-4 mb-2 border-b border-primary/20 pb-1">{line.slice(3)}</h3>;
                    if (line.startsWith('- ')) return <div key={i} className="flex gap-2 text-sm text-foreground mb-1"><span className="text-primary shrink-0">—</span><span>{line.slice(2)}</span></div>;
                    if (line === '---') return <hr key={i} className="border-border/30 my-3" />;
                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-medium text-foreground">{line.slice(2, -2)}</p>;
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-foreground/90 leading-relaxed">{line}</p>;
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-sm text-muted-foreground/60">
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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Content Studio
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {brand.mode === 'campaign' ? 'Campaign & character content tools' : 'Community content tools'} — {brand.name}
        </p>
      </div>

      {brand.mode === 'campaign' && (
        <>
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              Campaign Tools
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{brand.short}</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAMPAIGN_TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolSelect(tool)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Community Tools (CHUR.BET)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {COMMUNITY_TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolSelect(tool)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {brand.mode === 'community' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMUNITY_TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => handleToolSelect(tool)}
            />
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
      <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
      {field.type === 'select' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-background/50">
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
          className="bg-background/50"
        />
      )}
    </div>
  );
}
