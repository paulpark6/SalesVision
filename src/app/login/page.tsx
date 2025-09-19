'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React,
{ useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = React.useState('admin');
  const { login, auth } = useAuth();

  useEffect(() => {
    // If the user is already logged in, redirect them to their dashboard
    if (auth?.role) {
      if (auth.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/admin');
      }
    }
  }, [auth, router]);

  const handleLogin = () => {
    login(role as 'admin' | 'employee' | 'manager'); // Save role to localStorage
    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };

  // If auth is loading, show a blank screen to prevent flashing the login page
  if (auth === undefined) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
       <div className="flex items-center gap-2 font-semibold mb-4">
            <LineChart className="h-8 w-8 text-primary" />
            <span className="text-2xl">SalesVision</span>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required defaultValue="admin@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required defaultValue="password" />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" value={role} onValueChange={setRole} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col">
          <Button className="w-full" onClick={handleLogin}>
            Sign in
          </Button>
           <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
