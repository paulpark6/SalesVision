'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { LineChart, Shield, UserCog, User } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { auth, login } = useAuth();
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

    const handleGoogleLogin = () => {
        // In production, this would trigger Google OAuth via IAP
        // For now, show dev mode options
        alert('Google Sign-In is configured via Cloud IAP in production.');
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
                        {isDev ? 'Development Mode - Select a role to continue' : 'Sign in with your Google account'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isDev ? (
                        <Button
                            onClick={handleGoogleLogin}
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            Sign in with Google
                        </Button>
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
