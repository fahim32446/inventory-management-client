import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { MenuItemProps } from './AppSidebar';
import { hexToRgba } from '../../utils/helper';

export const MenuItem = ({
  item,
  level = 0,
  parentKey = '',
  collapsed,
  openMenus,
  activeRoute,
  onToggle,
  onNavigate,
  primaryColor,
  isLightSidebar,
  compactMode,
  isLastChild,
}: MenuItemProps) => {
  const key = parentKey ? `${parentKey}-${item.label}` : item.label;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = openMenus[key];
  const Icon = item.icon;
  const isActive = activeRoute === item.path;
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Handle hover for collapsed state
  useEffect(() => {
    if (collapsed && isHovered && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8, // Add some gap
      });
    }
  }, [collapsed, isHovered]);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (collapsed) {
      setIsHovered(true);
      // Calculate position immediately on enter
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.top,
          left: rect.right + 8, // Slightly closer gap
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (collapsed) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 150);
    }
  };

  if (collapsed && level > 0) return null;

  return (
    <div
      ref={itemRef}
      className='w-full relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!collapsed && level > 0 && (
        <>
          <div
            className={cn(
              'absolute left-0 top-0 w-px',
              isLastChild ? (compactMode ? 'h-4' : 'h-6') : 'bottom-0',
              isLightSidebar ? 'bg-linear-to-b bg-gray-200' : 'bg-linear-to-b bg-gray-700',
            )}
            style={{ left: `${level * 1.5 - 0.1}rem` }}
          />
          <div
            className={cn(
              compactMode ? 'top-4' : 'top-6',
              'absolute w-4 h-px',
              isLightSidebar ? 'bg-gray-200' : 'bg-gray-700',
            )}
            style={{ left: `${level * 1.5 - 0.1}rem` }}
          />
        </>
      )}

      <button
        onClick={() => {
          if (hasChildren) {
            onToggle(key);
          } else if (item.path) {
            onNavigate(item.path);
          }
        }}
        className={cn(
          compactMode ? 'py-2' : 'py-3',
          'w-full flex items-center px-4 transition-all duration-200 group relative cursor-pointer',
          collapsed ? 'justify-center px-2' : 'justify-between',
          isActive
            ? 'text-white border-l-4'
            : isLightSidebar
              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white',
        )}
        style={{
          paddingLeft: !collapsed && level > 0 ? `${1 + level * 1.5}rem` : undefined,
          backgroundColor: isActive ? undefined : undefined,
          background: isActive
            ? `linear-gradient(90deg, ${hexToRgba(primaryColor, 0.2)} 0%, ${hexToRgba(
                primaryColor,
                0.05,
              )} 100%)`
            : undefined,
          borderColor: isActive ? primaryColor : 'transparent',
          color: isActive ? primaryColor : undefined,
        }}
        title={collapsed ? item.label : undefined}
      >
        <div
          className={cn(
            'flex items-center gap-3',
            collapsed ? 'justify-center flex-col gap-0.5' : 'flex-1',
          )}
        >
          {Icon && (
            <Icon
              size={compactMode ? 16 : 20}
              className={cn(
                'shrink-0 transition-colors duration-200',
                isActive
                  ? ''
                  : isLightSidebar
                    ? 'text-gray-800 group-hover:text-gray-700'
                    : 'text-gray-50 group-hover:text-white',
              )}
              style={{ color: isActive ? primaryColor : undefined }}
            />
          )}

          {/* {!collapsed && ( */}
          <span
            className={cn(
              collapsed ? 'w-17.5 pl-1 text-xs!' : '',
              compactMode ? 'text-xs' : 'text-sm',
              'font-medium transition-colors duration-200 truncate',
              isActive
                ? ''
                : isLightSidebar
                  ? 'text-gray-800 group-hover:text-gray-900'
                  : 'text-gray-50 group-hover:text-white',
            )}
            style={{ color: isActive ? primaryColor : undefined }}
          >
            {item.label}
          </span>
          {/* )} */}
        </div>

        {!collapsed && hasChildren && (
          <div>
            <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
              <ChevronDown
                size={compactMode ? 14 : 16}
                className={cn(
                  isLightSidebar
                    ? 'text-gray-400 group-hover:text-gray-600'
                    : 'text-gray-400 group-hover:text-white',
                )}
              />
            </motion.div>
          </div>
        )}
      </button>

      {!collapsed && hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='overflow-hidden'
            >
              <div className='py-1'>
                {item.children!.map((child, idx) => (
                  <MenuItem
                    key={idx}
                    item={child}
                    level={level + 1}
                    parentKey={key}
                    collapsed={collapsed}
                    openMenus={openMenus}
                    activeRoute={activeRoute}
                    onToggle={onToggle}
                    onNavigate={onNavigate}
                    primaryColor={primaryColor}
                    isLightSidebar={isLightSidebar}
                    compactMode={compactMode}
                    isLastChild={idx === item.children!.length - 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Floating Menu for Collapsed State using Portal */}
      {collapsed &&
        isHovered &&
        createPortal(
          <div
            className='fixed z-50 animate-in fade-in zoom-in-95 duration-200'
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={cn(
                'border rounded-lg shadow-xl w-56 overflow-hidden',
                isLightSidebar ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-700',
              )}
            >
              <div
                className={cn(
                  'px-4 py-3 border-b',
                  isLightSidebar
                    ? 'bg-gray-50 border-gray-100'
                    : 'bg-slate-950/50 border-slate-800',
                )}
              >
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isLightSidebar ? 'text-gray-800' : 'text-white',
                  )}
                >
                  {item.label}
                </span>
              </div>
              {hasChildren && (
                <div className='py-1 max-h-[calc(100vh-100px)] overflow-y-auto'>
                  {item.children!.map((child, idx) => (
                    <MenuItem
                      key={idx}
                      item={child}
                      level={0}
                      parentKey={key}
                      collapsed={false} // Force expanded view in tooltip
                      openMenus={openMenus}
                      activeRoute={activeRoute}
                      onToggle={onToggle}
                      onNavigate={onNavigate}
                      primaryColor={primaryColor}
                      isLightSidebar={isLightSidebar}
                      compactMode={compactMode}
                      isLastChild={idx === item.children!.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
