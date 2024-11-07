// app/setup/page.tsx
'use client'

import { useState } from 'react';
import { createInitialSuperAdmin } from '@/app/actions/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Setup() {
  const [status, setStatus] = useState('');

  const handleSetup = async () => {
    try {
      const result = await createInitialSuperAdmin();
      setStatus(result.success ? 'SuperAdmin created successfully' : result.error || 'Failed to create SuperAdmin');
    } catch (error) {
      setStatus('Failed to create SuperAdmin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Setup SuperAdmin Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSetup}>Create SuperAdmin</Button>
          {status && <p className="text-sm text-gray-600">{status}</p>}
          {status === 'SuperAdmin created successfully' && (
            <div className="text-sm space-y-2">
              <p>Email: superadmin@clex.com</p>
              <p>Password: superadmin123</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}