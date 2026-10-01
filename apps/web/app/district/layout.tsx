'use client';

import React from 'react';
import AuthLayout from '../../components/AuthLayout';

export default function DistrictLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={['district_admin']}>{children}</AuthLayout>;
}
