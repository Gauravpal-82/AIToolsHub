import { useState } from "react";
import { Star, ExternalLink, Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Tool } from "@shared/schema";

interface ToolCardProps {
  tool: Tool;
  showActions?: boolean;
  onRemove?: (toolId: string) => void;
  onToggleFavorite?: (toolId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export function ToolCard({ 
  tool, 
  showActions = false, 
  onRemove, 
  onToggleFavorite,
  isFavorite = false 
}: ToolCardProps) {
  const [imageError, setImageError] = useState(false);

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "free":
        return "bg-green-500 hover:bg-green-600";
      case "freemium":
        return "bg-orange-500 hover:bg-orange-600";
      case "paid":
        return "bg-neon-purple hover:bg-purple-600";
      case "one-time":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatPricing = (pricing: string) => {
    switch (pricing) {
      case "free":
        return "Free";
      case "freemium":
        return "Freemium";
      case "paid":
        return "Paid";
      case "one-time":
        return "One-time";
      default:
        return pricing;
    }
  };

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

  return (
    <Card className="tool-card glass-effect rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative">
      {showActions && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleFavorite?.(tool.id, !isFavorite)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full ${
            isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-red-500"
          } transition-colors`}
          data-testid={`button-favorite-${tool.id}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-white" : ""} text-white`} />
        </Button>
      )}
      
      <div className="relative">
        {!imageError && tool.imageUrl ? (
          <img
            src={tool.imageUrl}
            alt={`${tool.name} interface`}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
            data-testid={`img-tool-${tool.id}`}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
            <div className="text-4xl font-bold text-muted-foreground opacity-50">
              {tool.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" data-testid={`text-tool-name-${tool.id}`}>
            {tool.name}
          </h3>
          <Badge className={`text-xs px-2 py-1 ${getPricingColor(tool.pricing)}`}>
            {formatPricing(tool.pricing)}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`text-tool-description-${tool.id}`}>
          {tool.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex">
              {renderStars(tool.rating || 0)}
            </div>
            <span className="text-sm text-muted-foreground" data-testid={`text-tool-rating-${tool.id}`}>
              {tool.rating?.toFixed(1) || "0.0"}
            </span>
          </div>

          <div className="flex space-x-2">
            {showActions && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(tool.id)}
                className="text-muted-foreground hover:text-red-500 p-2"
                data-testid={`button-remove-${tool.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-neon-blue p-2"
              data-testid={`button-external-${tool.id}`}
            >
              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>

            <Link href={`/tools/${tool.id}`}>
              <Button
                className="bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                data-testid={`button-view-details-${tool.id}`}
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
