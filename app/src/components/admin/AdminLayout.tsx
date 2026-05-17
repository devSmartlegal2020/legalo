import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Upload,
  Calendar,
  BookOpen,
  Mail,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [isEbookOpen, setIsEbookOpen] = useState(false);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      label: 'Blogs',
      icon: FileText,
      isExpandable: true,
      isOpen: isContentOpen,
      onToggle: () => setIsContentOpen(!isContentOpen),
      subItems: [
        { path: '/admin/blogs', label: 'All Blogs' },
        { path: '/admin/blogs/new', label: 'Add New' },
        { path: '/admin/categories', label: 'Categories' },
        { path: '/admin/ctas', label: 'CTAs' },
        { path: '/admin/import', label: 'Import' },
      ],
    },
    {
      label: 'Event',
      icon: Calendar,
      isExpandable: true,
      isOpen: isEventOpen,
      onToggle: () => setIsEventOpen(!isEventOpen),
      subItems: [
        { path: '/admin/events', label: 'All Events' },
        { path: '/admin/events/new', label: 'Add Event' },
      ],
    },
    {
      label: 'Promotions',
      icon: FolderOpen,
      isExpandable: true,
      isOpen: isPromotionOpen,
      onToggle: () => setIsPromotionOpen(!isPromotionOpen),
      subItems: [
        { path: '/admin/promotions', label: 'All Promotions' },
        { path: '/admin/promotions/new', label: 'Add Promotion' },
      ],
    },
    {
      label: 'E-books',
      icon: BookOpen,
      isExpandable: true,
      isOpen: isEbookOpen,
      onToggle: () => setIsEbookOpen(!isEbookOpen),
      subItems: [
        { path: '/admin/ebooks', label: 'All E-books' },
        { path: '/admin/ebooks/new', label: 'Add E-book' },
      ],
    },
    {
      label: 'Marketing',
      icon: Mail,
      isExpandable: true,
      isOpen: isMarketingOpen,
      onToggle: () => setIsMarketingOpen(!isMarketingOpen),
      subItems: [
        { path: '/admin/newsletter-subscribers', label: 'Subscribers' },
      ],
    },
    ...(user?.role === 'admin'
      ? [
          { path: '/admin/users', label: 'Users', icon: Users },
          { path: '/admin/settings', label: 'Settings', icon: Settings },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-xl">Legalo CMS</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:transform-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b">
              <span className="font-bold text-xl">Legalo CMS</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {menuItems.map((item, index) => {
                if ('isExpandable' in item && item.isExpandable) {
                  return (
                    <div key={index}>
                      <button
                        onClick={item.onToggle}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </div>
                        {item.isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {item.isOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems?.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-3 py-2 text-sm rounded-lg ${
                                isActive(subItem.path)
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path || '#'}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                      isActive(item.path || '')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="border-t p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-semibold text-blue-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
