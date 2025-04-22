import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import React, { useState } from "react";

const LoginUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword] = useState(false);
  const [error] = useState("");
  const [isSubmitting] = useState(false);

  const handleSubmit = () => {};
  const toggleShowPassword = () => {};
  return (
    <div>
      <div className='container max-w-md px-4 py-16'>
        <div className='space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold'>Admin Login</h1>
            <p className='text-gray-500'>Sign in to access the admin area</p>
          </div>

          {error && (
            <div className='p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
              <AlertCircle className='h-5 w-5' />
              <span>{error}</span>
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
              <p className='text-xs text-gray-500'>
                Demo: Use admin@example.com for admin access
              </p>
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
              <p className='text-xs text-gray-500'>
                Demo: Use "password" as the password
              </p>
            </div>

            <Button
              type='submit'
              className='w-full bg-orange-500 hover:bg-orange-600'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
