import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";
import { CategoryCard } from "@/components/CategoryCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import type { Tool } from "@shared/schema";
import toolsData from "@/data/tools.json";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: featuredTools, isLoading } = useQuery<Tool[]>({
    queryKey: ["/api/tools", { featured: true, limit: 3 }],
  });

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/discover?category=${categoryId}`);
  };

  const handleTaskClick = (taskId: string) => {
    const task = toolsData.taskShortcuts.find(t => t.id === taskId);
    if (task) {
      setLocation(`/discover?search=${task.keywords[0]}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Discover the <span className="gradient-text">Future</span> of AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-slide-up">
            Your ultimate hub for AI tools, insights, and innovation
          </p>
          
          {/* Search Bar */}
          <div className="mb-12 animate-slide-up">
            <SearchBar />
          </div>

          {/* Task Finder Shortcuts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {toolsData.taskShortcuts.map((task) => (
              <Card
                key={task.id}
                className="glass-effect rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer border-border hover:border-neon-blue/50"
                onClick={() => handleTaskClick(task.id)}
                data-testid={`task-shortcut-${task.id}`}
              >
                <CardContent className="p-0 text-center">
                  <div className="text-2xl mb-2 text-neon-blue">
                    {task.icon.includes('palette') ? '🎨' : 
                     task.icon.includes('pen') ? '✍️' :
                     task.icon.includes('video') ? '🎥' : '💻'}
                  </div>
                  <p className="text-sm font-medium">{task.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {toolsData.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </section>

      {/* Trending Tools */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trending AI Tools</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-effect rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools?.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
