import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Trophy, Medal, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import toolsData from "@/data/tools.json";

interface SubmissionForm {
  name: string;
  website: string;
  category: string;
  shortDescription: string;
  pricing: string;
  price: string;
  submittedBy: string;
}

export default function Community() {
  const [formData, setFormData] = useState<SubmissionForm>({
    name: "",
    website: "",
    category: "",
    shortDescription: "",
    pricing: "free",
    price: "",
    submittedBy: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitToolMutation = useMutation({
    mutationFn: async (data: SubmissionForm) => {
      const response = await apiRequest("POST", "/api/tools", {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.shortDescription, // Use short description for now
        category: data.category,
        pricing: data.pricing,
        price: data.price || undefined,
        website: data.website,
        submittedBy: data.submittedBy || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tool Submitted Successfully!",
        description: "Your tool submission is being reviewed by our team.",
      });
      setFormData({
        name: "",
        website: "",
        category: "",
        shortDescription: "",
        pricing: "free",
        price: "",
        submittedBy: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.website || !formData.category || !formData.shortDescription) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitToolMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof SubmissionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const topContributors = [
    { rank: 1, name: "Alex Chen", submissions: 47, upvotes: 23, icon: Trophy },
    { rank: 2, name: "Sarah Kim", submissions: 32, upvotes: 18, icon: Medal },
    { rank: 3, name: "Mike Johnson", submissions: 28, upvotes: 15, icon: Award },
  ];

  const recentSubmissions = [
    { name: "Notion AI", submittedTime: "2 hours ago", upvotes: 12, downvotes: 0 },
    { name: "Loom AI", submittedTime: "5 hours ago", upvotes: 8, downvotes: 1 },
    { name: "Perplexity AI", submittedTime: "1 day ago", upvotes: 24, downvotes: 2 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">AI Tools Community</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Tool Form */}
        <div className="lg:col-span-2">
          <Card className="glass-effect rounded-xl p-8">
            <CardHeader>
              <CardTitle>Submit a New AI Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tool Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., ChatGPT"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-card border-border focus:border-neon-blue transition-colors"
                      data-testid="input-tool-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Website URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="bg-card border-border focus:border-neon-blue transition-colors"
                      data-testid="input-tool-website"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="w-full bg-card border-border" data-testid="select-tool-category">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {toolsData.categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Brief description of what this tool does..."
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                    className="bg-card border-border focus:border-neon-blue transition-colors resize-none"
                    data-testid="textarea-tool-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pricing Model <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)}>
                      <SelectTrigger className="w-full bg-card border-border" data-testid="select-pricing-model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="one-time">One-time Purchase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Your name (optional)"
                      value={formData.submittedBy}
                      onChange={(e) => handleInputChange("submittedBy", e.target.value)}
                      className="bg-card border-border focus:border-neon-blue transition-colors"
                      data-testid="input-submitter-name"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitToolMutation.isPending}
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-purple py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  data-testid="button-submit-tool"
                >
                  {submitToolMutation.isPending ? "Submitting..." : "Submit Tool for Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard & Stats */}
        <div className="space-y-8">
          {/* Top Contributors */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContributors.map((contributor) => {
                  const IconComponent = contributor.icon;
                  const colorMap = {
                    1: "from-yellow-400 to-yellow-600",
                    2: "from-gray-400 to-gray-600", 
                    3: "from-orange-400 to-orange-600",
                  };
                  
                  return (
                    <div key={contributor.rank} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${colorMap[contributor.rank as keyof typeof colorMap]} rounded-full flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`text-contributor-${contributor.rank}-name`}>
                            {contributor.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contributor.submissions} submissions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm" data-testid={`text-contributor-${contributor.rank}-upvotes`}>
                          {contributor.upvotes}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div>
                      <p className="font-medium" data-testid={`text-recent-submission-${index}-name`}>
                        {submission.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{submission.submittedTime}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:text-green-400 p-1"
                        data-testid={`button-upvote-${index}`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{submission.upvotes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400 p-1"
                        data-testid={`button-downvote-${index}`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Tools</span>
                <Badge variant="outline" className="border-border">1,247</Badge>
              </div>
              <div className="flex justify-between">
                <span>Active Contributors</span>
                <Badge variant="outline" className="border-border">156</Badge>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <Badge variant="outline" className="border-border">43 new</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
