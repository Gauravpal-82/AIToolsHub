import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Check, X, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@shared/schema";

export default function Compare() {
  const [selectedTool1, setSelectedTool1] = useState<string>("");
  const [selectedTool2, setSelectedTool2] = useState<string>("");

  const { data: tools = [] } = useQuery<Tool[]>({
    queryKey: ["/api/tools"],
  });

  const tool1 = tools.find(t => t.id === selectedTool1);
  const tool2 = tools.find(t => t.id === selectedTool2);

  const canCompare = tool1 && tool2;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />);
    }

    return stars;
  };

  const getPricingBadge = (tool: Tool) => {
    const colorMap = {
      free: "bg-green-500",
      freemium: "bg-orange-500", 
      paid: "bg-neon-purple",
      "one-time": "bg-blue-500",
    };

    return (
      <div className="text-center">
        <Badge className={`${colorMap[tool.pricing as keyof typeof colorMap] || 'bg-gray-500'} text-white text-xs px-3 py-1`}>
          {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
        </Badge>
        <div className="text-sm text-muted-foreground mt-1">
          {tool.price || "See website"}
        </div>
      </div>
    );
  };

  const getToolIcon = (tool: Tool) => {
    if (tool.name.toLowerCase().includes('chat')) return '🤖';
    if (tool.category.includes('Image')) return '🎨';
    if (tool.category.includes('Code')) return '💻';
    if (tool.category.includes('Text')) return '✍️';
    if (tool.category.includes('Video')) return '🎥';
    if (tool.category.includes('Music')) return '🎵';
    return '🔧';
  };

  const comparisonFeatures = [
    {
      feature: "Pricing",
      getValue: (tool: Tool) => getPricingBadge(tool),
    },
    {
      feature: "Use Cases",
      getValue: (tool: Tool) => (
        <div className="text-center text-sm">
          {tool.category} • {tool.shortDescription.split('.')[0]}
        </div>
      ),
    },
    {
      feature: "Model Quality",
      getValue: (tool: Tool) => (
        <div className="text-center">
          <div className="flex justify-center mb-1">
            {renderStars(tool.rating || 0)}
          </div>
          <span className="text-sm text-muted-foreground">
            {tool.rating?.toFixed(1) || "0.0"}/5
          </span>
        </div>
      ),
    },
    {
      feature: "API Access",
      getValue: (tool: Tool) => (
        <div className="text-center">
          {tool.name === "ChatGPT" || tool.name === "GitHub Copilot" ? (
            <Check className="w-5 h-5 text-green-500 mx-auto" />
          ) : (
            <X className="w-5 h-5 text-red-500 mx-auto" />
          )}
        </div>
      ),
    },
    {
      feature: "Templates",
      getValue: (tool: Tool) => (
        <div className="text-center">
          {tool.name === "Jasper AI" || tool.name === "Copy.ai" ? (
            <>
              <Check className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">50+ templates</div>
            </>
          ) : (
            <X className="w-5 h-5 text-red-500 mx-auto" />
          )}
        </div>
      ),
    },
    {
      feature: "Team Collaboration",
      getValue: (tool: Tool) => (
        <div className="text-center">
          {tool.name === "Jasper AI" || tool.name === "Notion AI" ? (
            <Check className="w-5 h-5 text-green-500 mx-auto" />
          ) : (
            <X className="w-5 h-5 text-red-500 mx-auto" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">Compare AI Tools</h1>
      
      {/* Tool Selection */}
      <Card className="glass-effect rounded-xl p-8 mb-8">
        <CardHeader>
          <CardTitle>Select Tools to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tool 1</label>
              <Select value={selectedTool1} onValueChange={setSelectedTool1}>
                <SelectTrigger className="w-full bg-card border-border" data-testid="select-tool-1">
                  <SelectValue placeholder="Select a tool..." />
                </SelectTrigger>
                <SelectContent>
                  {tools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tool 2</label>
              <Select value={selectedTool2} onValueChange={setSelectedTool2}>
                <SelectTrigger className="w-full bg-card border-border" data-testid="select-tool-2">
                  <SelectValue placeholder="Select a tool..." />
                </SelectTrigger>
                <SelectContent>
                  {tools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {!canCompare && (
            <p className="text-muted-foreground text-center">
              Select two tools to see a detailed comparison
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {canCompare && (
        <Card className="glass-effect rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card border-b border-border">
                <tr>
                  <th className="text-left p-6 font-semibold">Feature</th>
                  <th className="text-center p-6 font-semibold">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl mb-2">{getToolIcon(tool1!)}</div>
                      <span data-testid="text-tool1-name">{tool1!.name}</span>
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl mb-2">{getToolIcon(tool2!)}</div>
                      <span data-testid="text-tool2-name">{tool2!.name}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={item.feature} className={index > 0 ? "border-t border-border" : ""}>
                    <td className="p-6 font-medium">{item.feature}</td>
                    <td className="p-6">{item.getValue(tool1!)}</td>
                    <td className="p-6">{item.getValue(tool2!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-card border-t border-border">
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
                data-testid="button-try-tool1"
              >
                <a href={tool1!.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Try {tool1!.name}
                </a>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-neon-purple to-pink-500 hover:opacity-90 transition-opacity"
                data-testid="button-try-tool2"
              >
                <a href={tool2!.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Try {tool2!.name}
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
