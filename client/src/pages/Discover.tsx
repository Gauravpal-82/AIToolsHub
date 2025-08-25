import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ToolCard } from "@/components/ToolCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import type { Tool } from "@shared/schema";
import toolsData from "@/data/tools.json";

export default function Discover() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    category: "",
    pricing: [] as string[],
    search: "",
    sortBy: "popular",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 12;

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [location]);

  const { data: tools = [], isLoading } = useQuery<Tool[]>({
    queryKey: ["/api/tools", { 
      category: filters.category || undefined,
      search: filters.search || undefined,
      limit: toolsPerPage,
      offset: (currentPage - 1) * toolsPerPage
    }],
  });

  const handlePricingFilter = (pricing: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      pricing: checked 
        ? [...prev.pricing, pricing]
        : prev.pricing.filter(p => p !== pricing)
    }));
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      pricing: [],
      search: "",
      sortBy: "popular",
    });
    setCurrentPage(1);
  };

  const filteredTools = tools.filter(tool => {
    if (filters.pricing.length > 0 && !filters.pricing.includes(tool.pricing)) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <Card className="glass-effect rounded-xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
                data-testid="button-clear-filters"
              >
                Clear All
              </Button>
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Pricing</h4>
              <div className="space-y-2">
                {["free", "freemium", "paid", "one-time"].map((pricing) => (
                  <div key={pricing} className="flex items-center space-x-2">
                    <Checkbox
                      id={pricing}
                      checked={filters.pricing.includes(pricing)}
                      onCheckedChange={(checked) => 
                        handlePricingFilter(pricing, checked as boolean)
                      }
                      data-testid={`checkbox-pricing-${pricing}`}
                    />
                    <label htmlFor={pricing} className="text-sm font-medium capitalize cursor-pointer">
                      {pricing === "one-time" ? "One-time Purchase" : pricing}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Category</h4>
              <div className="space-y-2">
                {toolsData.categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.category === category.id}
                      onCheckedChange={(checked) => 
                        handleCategoryFilter(checked ? category.id : "")
                      }
                      data-testid={`checkbox-category-${category.id}`}
                    />
                    <label htmlFor={category.id} className="text-sm font-medium cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <h4 className="font-semibold mb-3">Sort by</h4>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger className="w-full bg-card border-border" data-testid="select-sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Discover AI Tools</h1>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground" data-testid="text-tools-count">
                {filteredTools.length} tools found
              </span>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-neon-blue text-white" : ""}
                  data-testid="button-view-grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-neon-blue text-white" : ""}
                  data-testid="button-view-list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-effect rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <Card className="glass-effect rounded-xl p-12 text-center">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredTools.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-card hover:bg-accent"
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-neon-blue text-white" : "bg-card hover:bg-accent"}
                    data-testid={`button-page-${page}`}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={filteredTools.length < toolsPerPage}
                  className="bg-card hover:bg-accent"
                  data-testid="button-next-page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
