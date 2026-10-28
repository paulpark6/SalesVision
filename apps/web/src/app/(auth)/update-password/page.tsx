'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function UpdatePasswordPage() {
    const router = useRouter();
    // undefined = checking the link, false = invalid/expired link
    const [hasSession, setHasSession] = useState<boolean | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // supabase-js exchanges the ?code= from the email link for a session on load
        if (!supabase) {
            setHasSession(false);
            return;
        }
        supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const password = String(form.get('password'));
        if (password !== String(form.get('confirm'))) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        const { error: updateError } = await supabase!.auth.updateUser({ password });
        setIsLoading(false);
        if (updateError) {
            setError(updateError.message);
            return;
        }
        router.replace('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Set a new password</CardTitle>
                    <CardDescription>Choose a password of at least 8 characters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                    {hasSession === undefined && <p className="text-sm text-center">Checking your link…</p>}
                    {hasSession === false && (
                        <p className="text-sm text-center">
                            This link is invalid or has expired.{' '}
                            <Link href="/reset-password" className="underline">Request a new one</Link>.
                        </p>
                    )}
                    {hasSession && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New password</Label>
                                <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm password</Label>
                                <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                Save password
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
