'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { ROLES, TEST_ACCOUNTS } from '@/lib/constants';
import type { UserRole } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.custom<UserRole>().optional(),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  isSignUp?: boolean;
}

export default function AuthForm({ isSignUp = false }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema.refine(
        (data) => !isSignUp || (isSignUp && data.name && data.role), {
            message: "Name and role are required for sign up",
            path: isSignUp ? ["name", "role"] : [],
        }
    )),
    defaultValues: {
      role: 'Worker',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: AuthFormValues) => {
    setLoading(true);
    try {
      if (isSignUp) {
        if (!data.name || !data.role) {
            throw new Error("Name and role are required.");
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          name: data.name,
          email: user.email,
          role: data.role,
        });
        toast({ title: 'Success', description: 'Account created successfully!' });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: 'Success', description: 'Logged in successfully!' });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {isSignUp && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="홍길동" />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setValue('role', value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {TEST_ACCOUNTS[r as UserRole]?.name || r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>
        </>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignUp ? 'Create Account' : 'Log In'}
      </Button>
    </form>
  );
}
