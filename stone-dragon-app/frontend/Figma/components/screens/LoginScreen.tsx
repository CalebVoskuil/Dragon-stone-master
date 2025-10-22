import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDInput } from "../SDInput";
import { SDCard } from "../SDCard";
import { useAuth } from "../../hooks/useAuth";

interface LoginScreenProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onRegister, onForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { login, loading } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
    } catch (error) {
      setErrors({ general: "Invalid email or password" });
    }
  };

  const quickLogin = async (role: 'student' | 'coordinator' | 'admin-student' | 'admin-coordinator') => {
    const credentials = {
      student: { email: 'student@demo.com', password: 'password' },
      coordinator: { email: 'coordinator@demo.com', password: 'password' },
      'admin-student': { email: 'admin-student@demo.com', password: 'password' },
      'admin-coordinator': { email: 'admin-coordinator@demo.com', password: 'password' }
    };

    const { email, password } = credentials[role];
    setEmail(email);
    setPassword(password);
    
    try {
      await login(email, password);
    } catch (error) {
      setErrors({ general: "Login failed" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue tracking your volunteer hours</p>
        </div>

        {/* Login Form */}
        <SDCard padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            <SDInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="relative">
              <SDInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <SDButton
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
            >
              Sign In
            </SDButton>
          </form>
        </SDCard>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={onRegister}
              className="text-primary hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <SDCard className="bg-muted/50" padding="md">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Student:</strong> student@demo.com / password
              </div>
              <div>
                <strong>Coordinator:</strong> coordinator@demo.com / password
              </div>
              <div>
                <strong>Admin Student:</strong> admin-student@demo.com / password
              </div>
              <div>
                <strong>Admin Coordinator:</strong> admin-coordinator@demo.com / password
              </div>
            </div>
            
            {/* Quick Login Buttons */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Quick Login:</p>
              <div className="grid grid-cols-2 gap-2">
                <SDButton
                  variant="secondary"
                  size="sm"
                  onClick={() => quickLogin('student')}
                  disabled={loading}
                >
                  Student
                </SDButton>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onClick={() => quickLogin('coordinator')}
                  disabled={loading}
                >
                  Coordinator
                </SDButton>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onClick={() => quickLogin('admin-student')}
                  disabled={loading}
                >
                  Admin Student
                </SDButton>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onClick={() => quickLogin('admin-coordinator')}
                  disabled={loading}
                >
                  Admin Coord
                </SDButton>
              </div>
            </div>
          </div>
        </SDCard>
      </div>
    </div>
  );
}