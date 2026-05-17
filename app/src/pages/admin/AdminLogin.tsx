import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoadingState, setIsLoadingState] = useState(false);

  console.log('AdminLogin: Render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('AdminLogin: useEffect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (!isLoading && isAuthenticated) {
      console.log('AdminLogin: Redirecting to dashboard');
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔴🔴🔴 AdminLogin: Form submitted - START');
    console.log('🔴 Email:', email);
    console.log('🔴 Password length:', password.length);
    setError('');
    setIsLoadingState(true);

    try {
      console.log('🔴🔴🔴 AdminLogin: Calling login function');
      await login(email, password);
      console.log('🔴🔴🔴 AdminLogin: Login function completed successfully');
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err: any) {
      console.log('🔴🔴🔴 AdminLogin: Login error:', err.message);
      console.log('🔴🔴🔴 AdminLogin: Full error:', err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoadingState(false);
      console.log('🔴🔴🔴 AdminLogin: Form submitted - END');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to manage your blog content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@legalo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoadingState}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoadingState}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoadingState}
              onClick={() => console.log('🔴 Button clicked!')}
            >
              {isLoadingState ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
