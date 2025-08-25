import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import ToolDetail from "@/pages/ToolDetail";
import Compare from "@/pages/Compare";
import Community from "@/pages/Community";
import Blog from "@/pages/Blog";
import Toolkit from "@/pages/Toolkit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/discover" component={Discover} />
        <Route path="/tools/:id" component={ToolDetail} />
        <Route path="/compare" component={Compare} />
        <Route path="/community" component={Community} />
        <Route path="/blog" component={Blog} />
        <Route path="/toolkit" component={Toolkit} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ai-tools-hub-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
