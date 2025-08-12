import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cog, Bell } from "lucide-react";

interface NavigationHeaderProps {
  userRole: string;
  onRoleChange: (role: string) => void;
  unreadAlerts: number;
  onNotificationsClick: () => void;
}

export function NavigationHeader({ 
  userRole, 
  onRoleChange, 
  unreadAlerts, 
  onNotificationsClick 
}: NavigationHeaderProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getDisplayName = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName || lastName || 'User';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Cog className="text-primary-600 text-2xl mr-3 h-8 w-8" />
              <h1 className="text-xl font-bold text-neutral-900">CNCMate</h1>
            </div>
            
            {/* Role Selector */}
            <div className="hidden md:flex">
              <Select value={userRole} onValueChange={onRoleChange}>
                <SelectTrigger className="w-[180px] bg-neutral-100 border-neutral-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operator View</SelectItem>
                  <SelectItem value="supervisor">Supervisor View</SelectItem>
                  <SelectItem value="owner">Owner View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Indicators and Actions */}
          <div className="flex items-center space-x-4">
            {/* Real-time Status */}
            <div className="hidden sm:flex items-center space-x-2 bg-success-50 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-success-700 font-medium">Live</span>
            </div>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-neutral-600 hover:text-neutral-900"
              onClick={onNotificationsClick}
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-warning-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 min-w-[1.25rem]"
                >
                  {unreadAlerts}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm" data-testid="text-user-initials">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              <span 
                className="hidden md:block text-sm font-medium text-neutral-700" 
                data-testid="text-user-name"
              >
                {getDisplayName(user.firstName, user.lastName)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
