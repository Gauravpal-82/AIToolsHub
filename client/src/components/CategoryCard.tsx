import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    description?: string;
  };
  onClick?: (categoryId: string) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const getIconComponent = (iconClass: string) => {
    // Map FontAwesome classes to Lucide icons or use text fallback
    const iconMap: Record<string, string> = {
      "fas fa-comments": "💬",
      "fas fa-image": "🖼️",
      "fas fa-video": "🎥",
      "fas fa-code": "💻",
      "fas fa-music": "🎵",
      "fas fa-tasks": "✅",
      "fas fa-briefcase": "💼",
      "fas fa-robot": "🤖",
      "fas fa-palette": "🎨",
      "fas fa-pen-fancy": "✍️",
    };

    return iconMap[iconClass] || "🔧";
  };

  return (
    <Card
      className="category-card glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer border-border hover:border-neon-blue/50"
      onClick={() => onClick?.(category.id)}
      data-testid={`category-${category.id}`}
    >
      <CardContent className="p-0">
        <div className="text-3xl mb-3 text-neon-blue">
          {getIconComponent(category.icon)}
        </div>
        <p className="font-medium text-foreground">{category.name}</p>
        {category.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
