import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import toolsData from "@/data/tools.json";

interface SearchBarProps {
  onSearch?: (query: string, recommendations: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "What do you want to do with AI?",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) return;

    const queryLower = query.toLowerCase();
    let recommendations: string[] = [];

    // Find recommendations based on keywords
    for (const [key, tools] of Object.entries(toolsData.aiRecommendations)) {
      if (queryLower.includes(key)) {
        recommendations = tools;
        break;
      }
    }

    if (recommendations.length > 0) {
      toast({
        title: "AI Tool Recommendations",
        description: `For "${query}": ${recommendations.slice(0, 3).join(', ')}`,
      });
    }

    if (onSearch) {
      onSearch(query, recommendations);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <div className="glass-effect rounded-full p-2">
        <div className="flex items-center">
          <Search className="text-neon-blue ml-6 h-5 w-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-0 px-6 py-4 text-lg focus:outline-none focus:ring-0 text-foreground placeholder-muted-foreground"
            data-testid="input-search"
          />
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
            data-testid="button-search"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
