'use client';

import React from 'react';
import AuthLayout from '../../components/AuthLayout';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={['field_agent']}>{children}</AuthLayout>;
}
