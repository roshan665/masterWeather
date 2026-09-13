import React from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Permission, UserRole } from '../../types';

interface PermissionGateProps {
  permission?: Permission;
  role?: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  disabledMode?: boolean;
  disabledTooltip?: string;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  role,
  children,
  fallback = null,
  disabledMode = false,
  disabledTooltip,
}) => {
  const { hasPermission, hasRole } = useAuth();

  let isAllowed = true;

  if (permission && !hasPermission(permission)) {
    isAllowed = false;
  }

  if (role && !hasRole(role)) {
    isAllowed = false;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (disabledMode) {
    return (
      <div
        className="relative inline-block opacity-50 cursor-not-allowed group"
        title={disabledTooltip || `Action requires ${permission || (Array.isArray(role) ? role.join('/') : role)} privileges`}
      >
        <div className="pointer-events-none">{children}</div>
      </div>
    );
  }

  return <>{fallback}</>;
};
