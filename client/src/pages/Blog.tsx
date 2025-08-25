import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Clock, Eye, User } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { BlogPost } from "@shared/schema";
import blogData from "@/data/blogPosts.json";

export default function Blog() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: featuredPost } = useQuery<BlogPost>({
    queryKey: ["/api/blog", { featured: true, limit: 1 }],
    select: (data: BlogPost[]) => data[0],
  });

  const regularPosts = blogPosts.filter(post => !post.featured);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Successfully Subscribed!",
      description: "You'll receive our weekly AI newsletter soon.",
    });
    setEmail("");
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Featured: "bg-neon-blue",
      Tutorial: "bg-neon-purple",
      Guide: "bg-neon-blue",
      Business: "bg-neon-purple",
      Research: "bg-neon-blue",
      News: "bg-green-500",
      Reviews: "bg-orange-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded-xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">AI News & Insights</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Featured Article */}
          {featuredPost && (
            <Card className="glass-effect rounded-xl overflow-hidden mb-8">
              <div className="relative">
                {featuredPost.imageUrl ? (
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-64 object-cover"
                    data-testid="img-featured-post"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                    <div className="text-4xl font-bold text-muted-foreground opacity-50">
                      📰
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className={`${getCategoryColor(featuredPost.category)} text-white text-sm px-3 py-1`}>
                    Featured
                  </Badge>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(featuredPost.createdAt!).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4" data-testid="text-featured-post-title">
                  {featuredPost.title}
                </h2>
                
                <p className="text-muted-foreground mb-6" data-testid="text-featured-post-excerpt">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium" data-testid="text-featured-post-author">
                        {featuredPost.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {featuredPost.authorRole}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {featuredPost.views?.toLocaleString()}
                    </div>
                    <Button
                      className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
                      data-testid="button-read-featured-post"
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularPosts.slice(0, 4).map((post, index) => (
              <Card key={post.id} className="glass-effect rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      data-testid={`img-post-${index}`}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-card to-muted flex items-center justify-center">
                      <div className="text-2xl opacity-50">📄</div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <Badge className={`${getCategoryColor(post.category)} text-white text-sm mb-3`}>
                    {post.category}
                  </Badge>
                  
                  <h3 className="text-lg font-bold mb-3 line-clamp-2" data-testid={`text-post-title-${index}`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`text-post-excerpt-${index}`}>
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neon-blue hover:text-neon-purple transition-colors p-0"
                      data-testid={`button-read-post-${index}`}
                    >
                      Read <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Newsletter Signup */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Stay Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Get the latest AI news and tutorials delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card border-border focus:border-neon-blue transition-colors"
                  data-testid="input-blog-newsletter-email"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
                  data-testid="button-blog-newsletter-subscribe"
                >
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Popular Posts */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Popular This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogData.popularPosts.map((post) => (
                  <div key={post.id} className="flex space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      post.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                      post.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                      'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                    }`}>
                      {post.rank}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2" data-testid={`text-popular-post-${post.rank}-title`}>
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blogData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium" data-testid={`text-category-${index}-name`}>
                      {category.name}
                    </span>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest AI Tools */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Latest AI Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/discover">
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-accent justify-start"
                    data-testid="button-explore-tools"
                  >
                    🤖 Explore All Tools
                  </Button>
                </Link>
                <Link href="/community">
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-accent justify-start"
                    data-testid="button-submit-tool"
                  >
                    ➕ Submit New Tool
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
