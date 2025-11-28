'use client';
import { useState } from 'react';
import AuthForm from './auth-form';
import RoleSwitcher from './role-switcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="mx-auto grid w-[450px] gap-8">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Safety Guardian</h1>
          <p className="text-balance text-muted-foreground">
            {isSignUp ? 'Create an account to get started' : 'Log in to access your dashboard'}
          </p>
        </div>
        <Card>
          <CardHeader>
             <CardTitle className="text-2xl">{isSignUp ? 'Sign Up' : 'Log In'}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AuthForm isSignUp={isSignUp} />
            <div className="mt-4 text-center text-sm">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Button variant="link" className="p-0" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </Button>
            </div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <RoleSwitcher />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
