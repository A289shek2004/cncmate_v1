import { Button } from "@/components/ui/button";
import { Home, Cog, Briefcase, Bell, User } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadAlerts: number;
}

export function MobileNavigation({ activeTab, onTabChange, unreadAlerts }: MobileNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'machines', icon: Cog, label: 'Machines' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 md:hidden z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${
              activeTab === item.id ? 'text-primary-600' : 'text-neutral-500'
            }`}
            onClick={() => onTabChange(item.id)}
            data-testid={`button-mobile-${item.id}`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.id === 'alerts' && unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-warning-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </div>
            <span className="text-xs" data-testid={`text-mobile-${item.id}`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
