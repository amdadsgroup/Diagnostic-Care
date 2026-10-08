'use client';

import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  hint,
  children,
  id,
}) => {
  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      <label
        htmlFor={id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 600,
          color: '#1E293B',
          marginBottom: '6px',
        }}
      >
        <span>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </span>
        {hint && (
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          style={{
            fontSize: '12px',
            color: '#EF4444',
            marginTop: '5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
