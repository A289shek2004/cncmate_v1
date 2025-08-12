import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Brain, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: "Real-time Monitoring",
    path: "/",
    icon: Activity,
    description: "Live machine dashboard",
    badge: "LIVE"
  },
  {
    title: "Predictive Maintenance",
    path: "/maintenance",
    icon: Brain,
    description: "AI-powered analytics",
    badge: "3"
  },
  {
    title: "Operator & Jobs",
    path: "/jobs",
    icon: Users,
    description: "Job tracking & operators",
    badge: null
  },
  {
    title: "Quality & Defects",
    path: "/quality",
    icon: AlertTriangle,
    description: "Quality control & logging",
    badge: "2"
  },
  {
    title: "Performance",
    path: "/performance",
    icon: BarChart3,
    description: "Analytics dashboards",
    badge: null
  },
  {
    title: "Production Insights",
    path: "/insights",
    icon: FileText,
    description: "Reports & intelligence",
    badge: null
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-white">CNCMate</h2>
              <p className="text-xs text-slate-400">Smart Manufacturing Analytics</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200",
                  "hover:bg-slate-800/50 hover:text-white",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-300"
                )}
                data-testid={`nav-link-${item.path.replace('/', '') || 'home'}`}
              >
                <Icon className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                    
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "LIVE" ? "default" : "secondary"}
                        className={cn(
                          "text-xs px-2 py-0.5",
                          item.badge === "LIVE" 
                            ? "bg-green-500 text-white animate-pulse" 
                            : "bg-slate-600 text-slate-200"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Link href="/settings">
          <a
            className={cn(
              "flex items-center rounded-lg p-3 text-sm font-medium text-slate-300",
              "hover:bg-slate-800/50 hover:text-white transition-all duration-200",
              location === "/settings" && "bg-slate-800 text-white"
            )}
            data-testid="nav-link-settings"
          >
            <Settings className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
            {!isCollapsed && (
              <div>
                <div className="font-medium">Settings</div>
                <div className="text-xs text-slate-400 mt-0.5">System configuration</div>
              </div>
            )}
          </a>
        </Link>
      </div>
    </div>
  );
}