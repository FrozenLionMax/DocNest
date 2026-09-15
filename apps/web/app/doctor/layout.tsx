'use client';

import React from 'react';
import AuthLayout from '../../components/AuthLayout';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={['doctor']}>{children}</AuthLayout>;
}
