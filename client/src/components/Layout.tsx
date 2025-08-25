import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, Bot } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Discover", href: "/discover" },
    { name: "Compare", href: "/compare" },
    { name: "Community", href: "/community" },
    { name: "Blog", href: "/blog" },
    { name: "My Toolkit", href: "/toolkit" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-border backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center" data-testid="link-home">
                <Bot className="h-8 w-8 text-neon-blue mr-3" />
                <span className="text-xl font-bold gradient-text">AI Tools Hub</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-neon-blue"
                          : "text-foreground hover:text-neon-blue"
                      }`}
                      data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden p-2 hover:bg-gray-700"
                    data-testid="button-mobile-menu"
                  >
                    <Menu className="h-6 w-6 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-card border-border">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigationItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? "text-neon-blue bg-accent"
                              : "text-foreground hover:text-neon-blue hover:bg-accent"
                          }`}
                          data-testid={`mobile-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {item.name}
                        </button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
}
