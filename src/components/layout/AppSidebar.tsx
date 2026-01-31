import { Layers, LogOut, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogOutMutation } from '../../features/auth/api/authApi';
import { useAppSelector } from '../../hooks/hooks';
import { cn } from '../../utils/cn';
import { isLightColor } from '../../utils/themeUtils';
import { MenuItem } from './MenuItem';
import {
  MenuItemType,
  filterMenuItemsByPermission,
  getActiveOpenMenus,
  menuItems,
} from './menu-items-data';

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}

export interface MenuItemProps {
  item: MenuItemType;
  level?: number;
  parentKey?: string;
  collapsed: boolean;
  openMenus: Record<string, boolean>;
  activeRoute: string;
  onToggle: (key: string) => void;
  onNavigate: (path: string) => void;
  primaryColor: string;
  isLightSidebar: boolean;
  compactMode: boolean;
  isLastChild: boolean;
}

const AppSidebar = ({ collapsed, setCollapsed, isMobile }: AppSidebarProps) => {
  const { sidebarColor, primaryColor, compactMode } = useAppSelector((state) => state.theme);
  const permissions = useAppSelector((state) => state.auth.data?.permission);
  const isLightSidebar = isLightColor(sidebarColor);
  const height = compactMode ? 'h-14' : 'h-16';

  const navigate = useNavigate();
  const location = useLocation();
  const activeRoute = location.pathname;

  // 1. Filter by Permissions
  const permissionFilteredItems = filterMenuItemsByPermission(menuItems, permissions);

  const [searchQuery, setSearchQuery] = useState('');

  // 2. Filter by Search Query
  const filterBySearch = (items: MenuItemType[], query: string): MenuItemType[] => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();

    return items
      .map((item) => {
        const matchesLabel = item.label.toLowerCase().includes(lowerQuery);
        let childrenMatch = false;
        let filteredChildren: MenuItemType[] = [];

        if (item.children) {
          filteredChildren = filterBySearch(item.children, query);
          if (filteredChildren.length > 0) childrenMatch = true;
        }

        if (matchesLabel || childrenMatch) {
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          };
        }
        return null;
      })
      .filter(Boolean) as MenuItemType[];
  };

  const finalMenuItems = filterBySearch(permissionFilteredItems, searchQuery);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() =>
    getActiveOpenMenus(activeRoute, permissionFilteredItems),
  );

  // Auto-expand on search
  const getAllMenuKeys = (items: MenuItemType[], parentKey = '') => {
    const keys: Record<string, boolean> = {};
    const traverse = (nodes: MenuItemType[], pKey = '') => {
      for (const node of nodes) {
        const key = pKey ? `${pKey}-${node.label}` : node.label;
        if (node.children && node.children.length > 0) {
          keys[key] = true;
          traverse(node.children, key);
        }
      }
    };
    traverse(items, parentKey);
    return keys;
  };

  const [prevSearchQuery, setPrevSearchQuery] = useState('');

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    if (searchQuery) {
      setOpenMenus(getAllMenuKeys(finalMenuItems));
    } else {
      setOpenMenus(getActiveOpenMenus(activeRoute, permissionFilteredItems));
    }
  }

  const [prevActiveRoute, setPrevActiveRoute] = useState(activeRoute);
  if (activeRoute !== prevActiveRoute) {
    setPrevActiveRoute(activeRoute);
    const newOpenMenus = getActiveOpenMenus(activeRoute, permissionFilteredItems);
    if (Object.keys(newOpenMenus).length > 0) {
      setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
    }
  }

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const [logOut] = useLogOutMutation();
  const handleLogout = () => {
    logOut();
    // .unwrap()
    // .then(() => {
    //   window.location.href = '/login';
    // });
  };

  return (
    <div
      className={cn(
        'h-full flex flex-col transition-colors duration-300',
        isLightSidebar ? 'border-gray-200' : 'border-slate-800',
      )}
      style={{ backgroundColor: sidebarColor, borderRightWidth: '1px' }}
    >
      <div
        className={cn(
          height,
          'flex items-center border-b sticky top-0 z-10 transition-all duration-300',
          collapsed ? 'justify-center' : 'px-6',
          isLightSidebar ? 'border-gray-200' : 'border-gray-800',
        )}
        style={{ backgroundColor: sidebarColor }}
      >
        <div className={cn('flex items-center gap-3', collapsed ? 'justify-center w-full' : '')}>
          {!collapsed ? (
            <div className='flex items-center gap-2'>
              <div className='p-1.5 bg-linear-to-br from-blue-600 to-sky-400 rounded-lg shadow-lg'>
                <Layers className='text-white' size={compactMode ? 16 : 20} />
              </div>
              <div>
                <h1
                  className={cn(
                    compactMode ? 'text-lg' : 'text-xl',
                    'font-bold bg-clip-text text-transparent leading-none',
                    isLightSidebar
                      ? 'bg-linear-to-r from-blue-600 to-sky-600'
                      : 'bg-linear-to-r from-blue-400 to-sky-400',
                  )}
                >
                  INVENTORY 360
                </h1>
              </div>
            </div>
          ) : (
            <div className='p-1.5 bg-linear-to-br from-blue-500 to-sky-600 rounded-lg shadow-lg'>
              <Layers className='text-white' size={compactMode ? 16 : 20} />
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className={cn('p-4 border-b', isLightSidebar ? 'border-gray-200' : 'border-gray-800')}>
          <div className='relative'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            />
            <input
              type='text'
              placeholder='Search menu...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200',
                isLightSidebar
                  ? 'bg-gray-100 text-gray-900 placeholder-gray-500 border-none'
                  : 'bg-slate-800 text-white placeholder-gray-500',
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Removed scrollbar-thin class to rely on global custom scrollbar styles from index.css */}
      <nav className='flex-1 overflow-y-auto py-2 hover:overflow-y-auto'>
        {finalMenuItems.length > 0
          ? finalMenuItems.map((item, idx) => (
              <MenuItem
                key={idx}
                item={item}
                collapsed={collapsed}
                openMenus={openMenus}
                activeRoute={activeRoute}
                onToggle={toggleMenu}
                onNavigate={handleNavigation}
                primaryColor={primaryColor}
                isLightSidebar={isLightSidebar}
                compactMode={compactMode}
                isLastChild={idx === finalMenuItems.length - 1}
              />
            ))
          : !collapsed && (
              <div className='flex flex-col items-center justify-center py-12 px-4 text-gray-500'>
                <Search size={32} className='mb-2 opacity-50' />
                <p className='text-xs text-center'>No items found</p>
              </div>
            )}
      </nav>

      <div
        className={cn(
          compactMode ? 'p-2' : 'p-4',
          'border-t',
          isLightSidebar ? 'border-gray-200' : 'border-gray-800',
        )}
        style={{ backgroundColor: sidebarColor }}
      >
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex cursor-pointer items-center gap-3 rounded-lg transition-all duration-200 group',
            isLightSidebar
              ? 'text-gray-600 hover:bg-gray-100 hover:text-red-500'
              : 'text-gray-400 hover:bg-slate-800 hover:text-red-400',
            collapsed ? 'justify-center p-2' : 'px-4 py-2',
          )}
          title='Logout'
        >
          <LogOut size={compactMode ? 16 : 20} className='transition-colors' />
          {!collapsed && <span className='text-sm font-medium'>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
