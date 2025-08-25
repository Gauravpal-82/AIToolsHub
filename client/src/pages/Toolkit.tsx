import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/ToolCard";
import { Grid, List, User, LogOut, Bolt, Heart, Folder, TrendingUp, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Tool, UserTool } from "@shared/schema";

interface MockUser {
  name: string;
  email: string;
  joinedDate: string;
}

export default function Toolkit() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user data - in a real app this would come from authentication
  const mockUser: MockUser = {
    name: "John Doe",
    email: "john@example.com",
    joinedDate: "March 2024"
  };

  const { data: userTools = [], isLoading } = useQuery<(UserTool & { tool: Tool })[]>({
    queryKey: ["/api/user/tools"],
  });

  const addToolMutation = useMutation({
    mutationFn: async ({ toolId, collectionName }: { toolId: string; collectionName?: string }) => {
      const response = await apiRequest("POST", "/api/user/tools", {
        toolId,
        isFavorite: false,
        collectionName,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/tools"] });
      toast({
        title: "Tool Added",
        description: "Tool has been added to your toolkit.",
      });
    },
  });

  const removeToolMutation = useMutation({
    mutationFn: async (toolId: string) => {
      await apiRequest("DELETE", `/api/user/tools/${toolId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/tools"] });
      toast({
        title: "Tool Removed",
        description: "Tool has been removed from your toolkit.",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ toolId, isFavorite }: { toolId: string; isFavorite: boolean }) => {
      await apiRequest("PATCH", `/api/user/tools/${toolId}`, { isFavorite });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/tools"] });
    },
  });

  const handleRemoveTool = (toolId: string) => {
    removeToolMutation.mutate(toolId);
  };

  const handleToggleFavorite = (toolId: string, isFavorite: boolean) => {
    toggleFavoriteMutation.mutate({ toolId, isFavorite });
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Collection Name Required",
        description: "Please enter a name for your collection.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would create a collection via API
    toast({
      title: "Collection Created",
      description: `Collection "${newCollectionName}" has been created.`,
    });
    
    setNewCollectionName("");
    setShowNewCollectionForm(false);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Get collections from user tools
  const collections = Array.from(new Set(
    userTools
      .filter(ut => ut.collectionName)
      .map(ut => ut.collectionName!)
  ));

  // Filter tools based on selected collection
  const filteredTools = selectedCollection === "all" 
    ? userTools 
    : userTools.filter(ut => 
        selectedCollection === "favorites" 
          ? ut.isFavorite 
          : ut.collectionName === selectedCollection
      );

  // Calculate stats
  const stats = {
    totalTools: userTools.length,
    favorites: userTools.filter(ut => ut.isFavorite).length,
    collections: collections.length,
    thisMonth: userTools.filter(ut => {
      const addedDate = new Date(ut.addedAt!);
      const now = new Date();
      return addedDate.getMonth() === now.getMonth() && addedDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">My AI Toolkit</h1>
        <p className="text-muted-foreground">Organize and manage your favorite AI tools</p>
      </div>

      {/* User Profile Section */}
      <Card className="glass-effect rounded-xl p-6 mb-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold" data-testid="text-user-name">
                  Welcome back, {mockUser.name}!
                </h2>
                <p className="text-muted-foreground" data-testid="text-user-stats">
                  You have {stats.totalTools} tools in your toolkit
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-border hover:bg-accent"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Toolkit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-effect rounded-xl p-6 text-center">
          <CardContent className="p-0">
            <Bolt className="w-8 h-8 text-neon-blue mx-auto mb-3" />
            <h3 className="text-2xl font-bold" data-testid="text-stat-total-tools">
              {stats.totalTools}
            </h3>
            <p className="text-muted-foreground">Saved Bolt</p>
          </CardContent>
        </Card>
        
        <Card className="glass-effect rounded-xl p-6 text-center">
          <CardContent className="p-0">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold" data-testid="text-stat-favorites">
              {stats.favorites}
            </h3>
            <p className="text-muted-foreground">Favorites</p>
          </CardContent>
        </Card>
        
        <Card className="glass-effect rounded-xl p-6 text-center">
          <CardContent className="p-0">
            <Folder className="w-8 h-8 text-neon-purple mx-auto mb-3" />
            <h3 className="text-2xl font-bold" data-testid="text-stat-collections">
              {stats.collections}
            </h3>
            <p className="text-muted-foreground">Collections</p>
          </CardContent>
        </Card>
        
        <Card className="glass-effect rounded-xl p-6 text-center">
          <CardContent className="p-0">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold" data-testid="text-stat-this-month">
              {stats.thisMonth}
            </h3>
            <p className="text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Collections Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glass-effect rounded-xl p-6">
            <CardHeader>
              <CardTitle>Collections</CardTitle>
            </CardHeader>
            <CardContent>
              {!showNewCollectionForm ? (
                <Button
                  onClick={() => setShowNewCollectionForm(true)}
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-purple mb-4 hover:opacity-90 transition-opacity"
                  data-testid="button-new-collection"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              ) : (
                <div className="mb-4 space-y-2">
                  <Input
                    placeholder="Collection name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="bg-card border-border"
                    data-testid="input-collection-name"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleCreateCollection}
                      className="bg-neon-blue hover:bg-blue-600"
                      data-testid="button-create-collection"
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowNewCollectionForm(false);
                        setNewCollectionName("");
                      }}
                      className="border-border"
                      data-testid="button-cancel-collection"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  variant={selectedCollection === "all" ? "default" : "ghost"}
                  onClick={() => setSelectedCollection("all")}
                  className={`w-full justify-between ${
                    selectedCollection === "all" ? "bg-neon-blue text-white" : "hover:bg-accent"
                  }`}
                  data-testid="button-collection-all"
                >
                  <span>All Bolt</span>
                  <Badge variant="outline" className="border-border">
                    {stats.totalTools}
                  </Badge>
                </Button>
                
                <Button
                  variant={selectedCollection === "favorites" ? "default" : "ghost"}
                  onClick={() => setSelectedCollection("favorites")}
                  className={`w-full justify-between ${
                    selectedCollection === "favorites" ? "bg-neon-blue text-white" : "hover:bg-accent"
                  }`}
                  data-testid="button-collection-favorites"
                >
                  <span>Favorites</span>
                  <Badge variant="outline" className="border-border">
                    {stats.favorites}
                  </Badge>
                </Button>
                
                {collections.map((collection) => (
                  <Button
                    key={collection}
                    variant={selectedCollection === collection ? "default" : "ghost"}
                    onClick={() => setSelectedCollection(collection)}
                    className={`w-full justify-between ${
                      selectedCollection === collection ? "bg-neon-blue text-white" : "hover:bg-accent"
                    }`}
                    data-testid={`button-collection-${collection.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span>{collection}</span>
                    <Badge variant="outline" className="border-border">
                      {userTools.filter(ut => ut.collectionName === collection).length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bolt Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCollection === "all" ? "Your Saved Bolt" :
               selectedCollection === "favorites" ? "Favorite Bolt" :
               selectedCollection}
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-neon-blue text-white" : ""}
                data-testid="button-view-mode-grid"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-neon-blue text-white" : ""}
                data-testid="button-view-mode-list"
              >
                <List className="h-4 w-4" />
              </Button>
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
                <Bolt className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCollection === "all" 
                    ? "You haven't saved any tools yet. Start exploring to build your toolkit!"
                    : selectedCollection === "favorites"
                    ? "You haven't favorited any tools yet."
                    : `No tools in "${selectedCollection}" collection.`
                  }
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-neon-blue to-neon-purple"
                  data-testid="button-discover-tools"
                >
                  <a href="/discover">Discover Bolt</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredTools.map((userTool) => (
                <ToolCard
                  key={userTool.id}
                  tool={userTool.tool}
                  showActions={true}
                  onRemove={handleRemoveTool}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={userTool.isFavorite || false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
