'use client';

import React from 'react';
import {
  Home,
  Compass,
  CalendarCheck,
  MessageSquare,
  User,
  Search,
  Clock,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

export type NavItemKey =
  | 'home'
  | 'discover'
  | 'bookings'
  | 'messages'
  | 'profile'
  | 'search'
  | 'queue'
  | 'reports';

interface NavigationIconProps {
  name: NavItemKey;
  active?: boolean;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
}

const NAV_ICON_MAP: Record<NavItemKey, { icon: LucideIcon; label: string }> = {
  home: { icon: Home, label: 'Home' },
  discover: { icon: Compass, label: 'Discover' },
  bookings: { icon: CalendarCheck, label: 'Bookings' },
  messages: { icon: MessageSquare, label: 'Messages' },
  profile: { icon: User, label: 'Profile' },
  search: { icon: Search, label: 'Search' },
  queue: { icon: Clock, label: 'Queue' },
  reports: { icon: FileText, label: 'Reports' },
};

/**
 * Diagnostic Care Navigation Icon
 * Clean outline icon system for mobile & desktop navigation.
 * Active state: Signal Blue #0057FF.
 * Inactive state: Neutral black/gray.
 */
export const NavigationIcon: React.FC<NavigationIconProps> = ({
  name,
  active = false,
  size = 22,
  color,
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const item = NAV_ICON_MAP[name] || { icon: Home, label: name };
  const IconComponent = item.icon;
  const iconColor = color || (active ? BRAND_COLORS.primary : BRAND_COLORS.textMuted);

  return (
    <span
      className={`nav-icon ${active ? 'active' : ''} ${className}`}
      role="img"
      aria-label={ariaLabel || item.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        color: iconColor,
        transition: 'color 0.15s ease',
      }}
    >
      <IconComponent
        size={size}
        color={iconColor}
        strokeWidth={active ? 2.3 : strokeWidth}
        aria-hidden="true"
      />
    </span>
  );
};

export default NavigationIcon;
