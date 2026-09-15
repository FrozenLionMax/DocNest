'use client';

import React from 'react';
import AuthLayout from '../../components/AuthLayout';

export default function CompounderLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={['compounder']}>{children}</AuthLayout>;
}
