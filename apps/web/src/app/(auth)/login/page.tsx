'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { LineChart, Shield, UserCog, User } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { auth, error, login, loginWithPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const isDev = process.env.NODE_ENV === 'development';

    useEffect(() => {
        // If already authenticated, redirect to sales page
        if (auth) {
            router.replace('/sales');
        }
    }, [auth, router]);

    const handleLogin = async (role: 'director' | 'manager' | 'staff') => {
        setIsLoading(true);
        try {
            login(role);
            // Redirect all users to sales page
            router.push('/sales');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setIsLoading(true);
        try {
            await loginWithPassword(String(form.get('email')), String(form.get('password')));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <LineChart className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">SalesVision</CardTitle>
                    <CardDescription>
                        {isDev ? 'Development Mode - Select a role to continue' : 'Sign in with your email and password'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <p className="text-sm text-destructive text-center">
                            {error === 'User not registered in system' ? 'This account is not on the allowed list.' : error}
                        </p>
                    )}
                    {!isDev ? (
                        <>
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" autoComplete="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" autoComplete="current-password" required />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                Sign in
                            </Button>
                        </form>
                        <p className="text-sm text-center space-x-4">
                            <Link href="/signup" className="text-muted-foreground hover:underline">
                                Create account
                            </Link>
                            <Link href="/reset-password" className="text-muted-foreground hover:underline">
                                Forgot password?
                            </Link>
                        </p>
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-muted-foreground text-center mb-4">
                                DEV MODE: Select a role to simulate login
                            </p>
                            <div className="grid gap-3">
                                <Button
                                    onClick={() => handleLogin('director')}
                                    variant="default"
                                    className="w-full justify-start gap-3"
                                    disabled={isLoading}
                                >
                                    <Shield className="h-4 w-4" />
                                    Login as Admin (Director)
                                </Button>
                                <Button
                                    onClick={() => handleLogin('manager')}
                                    variant="secondary"
                                    className="w-full justify-start gap-3"
                                    disabled={isLoading}
                                >
                                    <UserCog className="h-4 w-4" />
                                    Login as Manager
                                </Button>
                                <Button
                                    onClick={() => handleLogin('staff')}
                                    variant="outline"
                                    className="w-full justify-start gap-3"
                                    disabled={isLoading}
                                >
                                    <User className="h-4 w-4" />
                                    Login as Staff
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
