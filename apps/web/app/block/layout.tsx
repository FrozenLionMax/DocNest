'use client';

import React from 'react';
import AuthLayout from '../../components/AuthLayout';

export default function BlockLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={['block_coordinator']}>{children}</AuthLayout>;
}
