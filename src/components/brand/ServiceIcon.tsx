'use client';

import React from 'react';
import {
  Stethoscope,
  TestTube2,
  Building2,
  HeartPulse,
  Pill,
  Ambulance,
  Home,
  UserCheck,
  Droplet,
  PackageCheck,
  Microscope,
  PhoneCall,
  ShieldAlert,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { BRAND_COLORS } from '@/config/brand';

export type HealthcareServiceType =
  | 'DOCTOR'
  | 'DIAGNOSTIC_TEST'
  | 'HOSPITAL'
  | 'CLINIC'
  | 'PHARMACY'
  | 'AMBULANCE'
  | 'HOME_HEALTHCARE'
  | 'NURSING'
  | 'BLOOD_BANK'
  | 'HEALTH_PACKAGE'
  | 'MEDICAL_EQUIPMENT'
  | 'EMERGENCY';

interface ServiceIconProps {
  type: HealthcareServiceType | string;
  size?: number;
  active?: boolean;
  strokeWidth?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

const SERVICE_ICON_MAP: Record<HealthcareServiceType, { icon: LucideIcon; label: string }> = {
  DOCTOR: { icon: Stethoscope, label: 'Doctor' },
  DIAGNOSTIC_TEST: { icon: TestTube2, label: 'Diagnostic Test' },
  HOSPITAL: { icon: Building2, label: 'Hospital' },
  CLINIC: { icon: HeartPulse, label: 'Clinic' },
  PHARMACY: { icon: Pill, label: 'Pharmacy' },
  AMBULANCE: { icon: Ambulance, label: 'Ambulance' },
  HOME_HEALTHCARE: { icon: Home, label: 'Home Healthcare' },
  NURSING: { icon: UserCheck, label: 'Nursing' },
  BLOOD_BANK: { icon: Droplet, label: 'Blood Bank' },
  HEALTH_PACKAGE: { icon: PackageCheck, label: 'Health Package' },
  MEDICAL_EQUIPMENT: { icon: Microscope, label: 'Medical Equipment' },
  EMERGENCY: { icon: ShieldAlert, label: 'Emergency' },
};

/**
 * Diagnostic Care Unified Healthcare Service Icon
 * Enforces cohesive rounded outline geometry, consistent stroke width,
 * and official brand color states: Signal Blue (#0057FF) active, black/neutral inactive.
 */
export const ServiceIcon: React.FC<ServiceIconProps> = ({
  type,
  size = 20,
  active = false,
  strokeWidth = 2,
  color,
  className = '',
  style = {},
  'aria-label': ariaLabel,
}) => {
  // Normalize type
  const normalizedKey = type.toUpperCase().replace(/\s+/g, '_') as HealthcareServiceType;
  const config = SERVICE_ICON_MAP[normalizedKey] || { icon: Activity, label: type };
  const IconComponent = config.icon;

  // Resolve color
  const iconColor = color || (active ? BRAND_COLORS.primary : BRAND_COLORS.textDark);

  return (
    <span
      className={`service-icon ${active ? 'active' : ''} ${className}`}
      role="img"
      aria-label={ariaLabel || config.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor,
        lineHeight: 0,
        ...style,
      }}
    >
      <IconComponent
        size={size}
        color={iconColor}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    </span>
  );
};

export default ServiceIcon;
