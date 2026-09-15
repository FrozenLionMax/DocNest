'use client';

import React from 'react';
import AuthLayout from '../../components/AuthLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={['admin']}>{children}</AuthLayout>;
}
