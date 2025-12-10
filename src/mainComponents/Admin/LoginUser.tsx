// src/mainComponents/Admin/LoginUser.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoginAdminMutation } from "@/redux-store/services/adminApi";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux-store/slices/authSlice";
import { useRecaptchaV2 } from "@/hooks/useRecaptchaV2";
import toast from "react-hot-toast";

const LoginUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(selectAuth);
  const { containerRef, render, reset, getToken } = useRecaptchaV2();
  const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";

  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!isDevelopment) {
      const timer = setTimeout(() => {
        render(
          undefined,
          () => toast.error("reCAPTCHA expired, please try again"),
          () => toast.error("reCAPTCHA error, please reload")
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [render, isDevelopment]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isRecaptchaReady = isDevelopment || !!getToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    let recaptchaToken: string | null = null;

    if (!isDevelopment) {
      recaptchaToken = getToken();
      if (!recaptchaToken) {
        setErrorMessage("Please complete the reCAPTCHA verification");
        return;
      }
    }

    try {
      const result = await loginAdmin({
        email,
        password,
        recaptchaToken: recaptchaToken || "dev-bypass",
      }).unwrap();

      if (!result.success) {
        setErrorMessage(result.message || "Login failed");
        if (!isDevelopment) reset();
      }
    } catch (err: any) {
      setErrorMessage(err.data?.message || "Login failed. Please try again.");
      if (!isDevelopment) reset();
    }
  };

  return (
    <div>
      <div className='container max-w-md px-4 py-16'>
        <div className='space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold'>Admin Login</h1>
            <p className='text-gray-500'>Sign in to access the admin area</p>
          </div>

          {(errorMessage || error) && (
            <div className='p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
              <AlertCircle className='h-5 w-5' />
              <span>{errorMessage || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='admin@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='pr-10'
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2'
                  onClick={toggleShowPassword}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </button>
              </div>
            </div>

            {/* reCAPTCHA - production only */}
            {!isDevelopment && (
              <div className='flex justify-center py-2'>
                <div ref={containerRef} />
              </div>
            )}

            {/* Development indicator */}
            {isDevelopment && (
              <div className='text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200'>
                <strong>Development Mode:</strong> reCAPTCHA bypassed
              </div>
            )}

            <Button
              type='submit'
              className='w-full bg-orange-500 hover:bg-orange-600'
              disabled={isLoading || (!isDevelopment && !isRecaptchaReady)}
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <LogIn className='h-4 w-4' />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <div className='pt-4 text-center'>
            <Link
              to='/'
              className='inline-flex items-center text-sm font-medium text-orange-500 hover:underline'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
