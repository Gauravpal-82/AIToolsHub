import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Star, ExternalLink, ArrowLeft, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ToolCard } from "@/components/ToolCard";
import type { Tool } from "@shared/schema";

export default function ToolDetail() {
  const [, params] = useRoute("/tools/:id");
  const toolId = params?.id;

  const { data: tool, isLoading } = useQuery<Tool>({
    queryKey: ["/api/tools", toolId],
    enabled: !!toolId,
  });

  const { data: relatedTools = [] } = useQuery<Tool[]>({
    queryKey: ["/api/tools", { category: tool?.category, limit: 3 }],
    enabled: !!tool?.category,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded-xl mb-6"></div>
              <div className="h-32 bg-muted rounded-xl"></div>
            </div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="glass-effect rounded-xl p-12 text-center">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-6">The tool you're looking for doesn't exist.</p>
            <Link href="/discover">
              <Button className="bg-gradient-to-r from-neon-blue to-neon-purple">
                Browse All Tools
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-400" />);
    }

    return stars;
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "free":
        return "bg-green-500";
      case "freemium":
        return "bg-orange-500";
      case "paid":
        return "bg-neon-purple";
      case "one-time":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/discover">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-accent"
          data-testid="button-back-to-discover"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discover
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tool Header */}
          <Card className="glass-effect rounded-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  {tool.imageUrl ? (
                    <img
                      src={tool.imageUrl}
                      alt={`${tool.name} logo`}
                      className="w-24 h-24 rounded-xl object-cover"
                      data-testid={`img-tool-logo-${tool.id}`}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {tool.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h1 className="text-3xl font-bold mb-2 md:mb-0" data-testid="text-tool-name">
                      {tool.name}
                    </h1>
                    <Badge className={`${getPricingColor(tool.pricing)} text-white text-sm px-3 py-1`}>
                      {tool.price || tool.pricing}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(tool.rating || 0)}
                      </div>
                      <span className="text-lg font-medium" data-testid="text-tool-rating">
                        {tool.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-border">
                      {tool.category}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-6" data-testid="text-tool-short-description">
                    {tool.shortDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
                      data-testid="button-visit-website"
                    >
                      <a href={tool.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border hover:bg-accent"
                      data-testid="button-add-to-toolkit"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to My Toolkit
                    </Button>
                    <Button
                      variant="ghost"
                      className="hover:bg-accent"
                      data-testid="button-save-favorite"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Save to Favorites
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tool Description */}
          <Card className="glass-effect rounded-xl">
            <CardHeader>
              <CardTitle>About {tool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed" data-testid="text-tool-description">
                {tool.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tool Info */}
          <Card className="glass-effect rounded-xl">
            <CardHeader>
              <CardTitle>Tool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Category</h4>
                <p className="text-muted-foreground">{tool.category}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Pricing Model</h4>
                <p className="text-muted-foreground capitalize">{tool.pricing}</p>
              </div>
              
              {tool.price && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Price</h4>
                    <p className="text-muted-foreground">{tool.price}</p>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Rating</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(tool.rating || 0)}
                  </div>
                  <span className="text-muted-foreground">
                    {tool.rating?.toFixed(1) || "0.0"} out of 5
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-effect rounded-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-border hover:bg-accent justify-start"
                data-testid="button-compare-tool"
              >
                Compare with other tools
              </Button>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-accent justify-start"
                data-testid="button-share-tool"
              >
                Share this tool
              </Button>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-accent justify-start"
                data-testid="button-report-issue"
              >
                Report an issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Similar Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTools.filter(t => t.id !== tool.id).slice(0, 3).map((relatedTool) => (
              <ToolCard key={relatedTool.id} tool={relatedTool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
