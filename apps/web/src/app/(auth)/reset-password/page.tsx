'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!supabase) {
            setError('Password reset is not configured');
            return;
        }
        setIsLoading(true);
        const email = String(new FormData(e.currentTarget).get('email'));
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
        setIsLoading(false);
        // Same message whether or not the account exists, so emails can't be probed
        if (resetError && resetError.status === 429) {
            setError('Too many requests. Please wait a minute and try again.');
        } else {
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Reset password</CardTitle>
                    <CardDescription>We&apos;ll email you a link to set a new password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                    {sent ? (
                        <p className="text-sm text-center">
                            If an account exists for that email, a reset link is on its way. Open it in this browser.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" autoComplete="email" required />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                Send reset link
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
