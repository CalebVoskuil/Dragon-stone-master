import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDInput } from "../SDInput";
import { SDCard } from "../SDCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "../../hooks/useAuth";

interface RegisterScreenProps {
  onLogin: () => void;
  onPrivacyPolicy: () => void;
}

export function RegisterScreen({ onLogin, onPrivacyPolicy }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    school: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, loading } = useAuth();

  const schools = [
    "Cape Town High School",
    "Wynberg Boys' High School", 
    "Wynberg Girls' High School",
    "Rondebosch Boys' High School",
    "Rondebosch Girls' High School",
    "University of Cape Town",
    "Stellenbosch University",
    "Cape Peninsula University of Technology",
    "Other"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 100) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }
    
    if (!formData.school) {
      newErrors.school = "Please select your school";
    }
    
    if (!acceptedPrivacy) {
      newErrors.privacy = "You must accept the Privacy Policy to continue";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        school: formData.school
      });
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Stone Dragon NPO and start making a difference</p>
        </div>

        {/* Registration Form */}
        <SDCard padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            <SDInput
              id="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
              autoComplete="name"
            />

            <SDInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="relative">
              <SDInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                hint="Minimum 8 characters"
                required
                autoComplete="new-password"
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

            <div className="relative">
              <SDInput
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <SDInput
              id="dateOfBirth"
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />

            <div className="space-y-2">
              <label className="block font-medium text-foreground">
                School <span className="text-destructive">*</span>
              </label>
              <Select 
                value={formData.school} 
                onValueChange={(value) => handleInputChange('school', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.school && (
                <p className="text-sm text-destructive">{errors.school}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => {
                    setAcceptedPrivacy(checked as boolean);
                    if (errors.privacy) {
                      setErrors(prev => ({ ...prev, privacy: "" }));
                    }
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="text-sm text-foreground cursor-pointer">
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={onPrivacyPolicy}
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </button>
                    . I understand how my data will be used.
                  </label>
                </div>
              </div>
              {errors.privacy && (
                <p className="text-sm text-destructive">{errors.privacy}</p>
              )}
            </div>

            <SDButton
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
            >
              Create Account
            </SDButton>
          </form>
        </SDCard>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={onLogin}
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}