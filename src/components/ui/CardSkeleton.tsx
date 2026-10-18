import React from 'react';

interface CardSkeletonProps {
  count?: number;
  type?: 'doctor' | 'facility' | 'test';
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 6, type = 'doctor' }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: type === 'doctor' ? '280px' : '220px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Skeleton Header */}
          <div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div
                style={{
                  width: type === 'doctor' ? '56px' : '44px',
                  height: type === 'doctor' ? '56px' : '44px',
                  borderRadius: '12px',
                  backgroundColor: '#F1F5F9',
                  animation: 'pulse 1.5s infinite ease-in-out',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: '18px',
                    width: '65%',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
                <div
                  style={{
                    height: '14px',
                    width: '45%',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
                <div
                  style={{
                    height: '12px',
                    width: '80%',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
              </div>
            </div>

            {/* Skeleton Middle Details */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                border: '1px solid #F1F5F9',
              }}
            >
              <div
                style={{
                  height: '12px',
                  width: '50%',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
              <div
                style={{
                  height: '12px',
                  width: '75%',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            </div>
          </div>

          {/* Skeleton Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '14px',
            }}
          >
            <div
              style={{
                height: '18px',
                width: '60px',
                backgroundColor: '#F1F5F9',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
            <div
              style={{
                height: '32px',
                width: '100px',
                backgroundColor: '#E2E8F0',
                borderRadius: '8px',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
