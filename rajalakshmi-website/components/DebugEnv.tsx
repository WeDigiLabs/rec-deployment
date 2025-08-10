'use client';

import { useEffect } from 'react';

export default function DebugEnv() {
  useEffect(() => {
    console.log('[DEBUG ENV] Client-side environment variables:', {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      wordBreak: 'break-all'
    }}>
      <strong>Debug Info:</strong><br/>
      API_BASE_URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}<br/>
      CMS_API_URL: {process.env.NEXT_PUBLIC_CMS_API_URL || 'undefined'}<br/>
      API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}<br/>
      NODE_ENV: {process.env.NODE_ENV || 'undefined'}
    </div>
  );
}
