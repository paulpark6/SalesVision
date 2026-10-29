'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (!supabase) {
            setError('Sign-up is not configured');
            return;
        }
        const form = new FormData(e.currentTarget);
        const email = String(form.get('email'));
        const password = String(form.get('password'));
        if (password !== String(form.get('confirm'))) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        setIsLoading(false);
        if (signUpError?.status === 429) {
            setError('Too many requests. Please wait a minute and try again.');
        } else if (signUpError && signUpError.code === 'weak_password') {
            setError(signUpError.message);
        } else {
            // Same message for approved and unapproved emails, so the allowed list can't be probed
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create account</CardTitle>
                    <CardDescription>Only emails approved by your admin can sign up.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                    {sent ? (
                        <p className="text-sm text-center">
                            If this email is approved, a confirmation link is on its way. Click it, then sign in.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" autoComplete="email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm password</Label>
                                <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                Create account
                            </Button>
                        </form>
                    )}
                    <p className="text-sm text-center">
                        <Link href="/login" className="text-muted-foreground hover:underline">Back to sign in</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
