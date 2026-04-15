import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        setSignUpSuccess(true);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate({ to: '/' });
      }
    }
    setLoading(false);
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6 text-center">
            <p className="text-[15px] font-semibold text-foreground mb-2">Check your email</p>
            <p className="text-[13px] text-muted-foreground">
              We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <Button variant="ghost" className="mt-4" onClick={() => { setIsSignUp(false); setSignUpSuccess(false); }}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-baseline">
            <span className="text-foreground font-bold text-[24px] tracking-[-0.035em]">respin</span>
            <span className="text-primary font-bold text-[24px]">.</span>
            <span className="text-muted-foreground font-normal text-[14px]">hub</span>
          </div>
          <p className="text-[13px] text-muted-foreground mt-1">Marketing Operating System</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-[15px] font-semibold text-center">
              {isSignUp ? 'Create account' : 'Sign in'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground">Full name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required={isSignUp}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-[12px] text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading || authLoading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {isSignUp ? 'Creating…' : 'Signing in…'}</>
                ) : (
                  isSignUp ? 'Create account' : 'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-[12px] text-primary hover:underline bg-transparent border-none cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
