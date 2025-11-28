'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { TEST_ACCOUNTS } from '@/lib/constants';
import type { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function RoleSwitcher() {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const { toast } = useToast();

  const handleLoginAs = async (role: UserRole) => {
    setLoadingRole(role);
    const account = TEST_ACCOUNTS[role];
    try {
      await signInWithEmailAndPassword(auth, account.email, account.password);
      toast({ title: `Logged in as ${account.name}` });
    } catch (error: any) {
        let description = error.message;
        if(error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            description = `Test user ${account.email} not found. Please create it in your Firebase Authentication console.`;
        }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description,
      });
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {(Object.keys(TEST_ACCOUNTS) as UserRole[]).map((role) => (
        <Button
          key={role}
          variant="outline"
          onClick={() => handleLoginAs(role)}
          disabled={!!loadingRole}
        >
          {loadingRole === role ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {TEST_ACCOUNTS[role].name}
        </Button>
      ))}
    </div>
  );
}
