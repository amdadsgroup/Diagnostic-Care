'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthError: React.FC<{ message: string; onDismiss?: () => void }> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 14px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FCA5A5',
        borderRadius: '10px',
        color: '#991B1B',
        fontSize: '13px',
        lineHeight: 1.45,
        marginBottom: '18px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>{message}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: 'none',
            border: 'none',
            color: '#991B1B',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '0 2px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export const AuthSuccess: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 14px',
        backgroundColor: '#F0FDF4',
        border: '1px solid #86EFAC',
        borderRadius: '10px',
        color: '#166534',
        fontSize: '13px',
        lineHeight: 1.45,
        marginBottom: '18px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>{message}</div>
    </div>
  );
};
