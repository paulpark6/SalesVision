
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function DelegateAuthorityPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;

  const [isDelegated, setIsDelegated] = useState(false);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth || (role !== 'employee' && role !== 'manager')) {
      router.push('/login');
    }
  }, [auth, router, role]);

  const handleToggleDelegation = (checked: boolean) => {
    setIsDelegated(checked);
    if (checked) {
      toast({
        title: 'Authority Delegated',
        description: 'Your authority has been delegated to an administrator.',
      });
    } else {
        toast({
        title: 'Authority Reclaimed',
        description: 'You have reclaimed your authority.',
      });
    }
  };

  const handleBack = () => {
    const dashboardPath = role === 'admin' ? '/dashboard' : '/admin';
    router.push(dashboardPath);
  };

  if (!role || (role !== 'employee' && role !== 'manager')) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Delegate Authority</CardTitle>
              <CardDescription>
                When you are on vacation or otherwise unavailable, you can delegate your authority to an administrator. They will be able to perform actions on your behalf.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        Enable Authority Delegation
                        </p>
                        <p className="text-sm text-muted-foreground">
                        All your tasks and approvals will be handled by an administrator.
                        </p>
                    </div>
                    <Switch
                        checked={isDelegated}
                        onCheckedChange={handleToggleDelegation}
                        aria-label="Delegate authority"
                    />
                </div>
                {isDelegated && (
                    <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-800 dark:text-green-300">Delegation Active</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-400">
                           Your authority is currently delegated. An administrator will handle your responsibilities. You can turn this off at any time.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                 <Button variant="outline" onClick={handleBack}>
                    Back to Dashboard
                </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
