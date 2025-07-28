'use client';

// import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogIn,
  LogOut, 
//   Users, 
//   Plus, 
  Activity,
  Monitor,
  Home,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Navbar() {
//   const { user, logout } = useAuth();
    const user = {
    name: 'John Doe',
    role: 'guest' // Example role, replace with actual user data
  };
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Define navigation items with roles and icons
  const navItems = [
    { href: '/', icon: Home, label: 'Home', roles: ['guest', 'admin', 'surgical_team'] },
    { href: '/status-board', icon: Monitor, label: 'Status Board', roles: ['guest', 'admin', 'surgical_team'] }

    // TODO: To be added later
    // { href: '/dashboard', icon: Activity, label: 'Dashboard', roles: ['admin', 'surgical_team'] },
    // { href: '/patients', icon: Users, label: 'Patients', roles: ['admin', 'surgical_team'] },
    // { href: '/patients/add', icon: Plus, label: 'Add Patient', roles: ['admin'] },

  ];

  const availableItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'guest')
  );

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'ADMIN', color: 'bg-red-100 text-red-800' };
      case 'surgical_team':
        return { label: 'SURGICAL TEAM', color: 'bg-blue-100 text-blue-800' };
      case 'guest':
      default:
        return { label: 'GUEST', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleDisplay = getRoleDisplay(user?.role);

  return (
    <nav className="bg-white shadow-lg border-b-2 border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Surgence</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Real-time Surgical Tracking</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {availableItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Display */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name || 'Guest User'}
                  </div>
                  <Badge className={`text-xs ${roleDisplay.color}`}>
                    {roleDisplay.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center space-x-2">
              {user?.role === 'guest' ? (
                <Link href="/login">
                  <Button size="sm" className="hidden sm:flex">
                    <LogIn className="h-4 w-4 mr-2" />
                    Staff Login
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                //   onClick={logout}
                  className="hidden sm:flex text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Mobile User Info */}
              <div className="px-3 py-2 border-b border-gray-100 mb-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name || 'Guest User'}
                    </div>
                    <Badge className={`text-xs ${roleDisplay.color}`}>
                      {roleDisplay.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {availableItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Auth Action */}
              <div className="pt-3 border-t border-gray-100">
                {user?.role === 'guest' ? (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      <LogIn className="h-4 w-4 mr-2" />
                      Staff Login
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}