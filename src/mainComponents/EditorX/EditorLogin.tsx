import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useLoginEditorMutation } from "@/redux-store/services/editorApi";
import { selectAuth, selectIsEditor } from "@/redux-store/slices/authSlice";

const EditorLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isEditor = useSelector(selectIsEditor);

  const [loginEditor, { isLoading }] = useLoginEditorMutation();

  // Only redirect editors here; an authenticated admin shouldn't be bounced
  // to the editor dashboard.
  useEffect(() => {
    if (isAuthenticated && isEditor) {
      navigate("/editor/dashboard");
    }
  }, [isAuthenticated, isEditor, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      const result = await loginEditor({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      if (!result.success) {
        setErrorMessage(result.message || "Login failed");
      }
      // Redirect handled by the effect once authSlice updates.
    } catch (err: any) {
      setErrorMessage(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md'>
        <Link
          to='/'
          className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6'
        >
          <ArrowLeft className='w-4 h-4 mr-1' />
          Back to site
        </Link>

        <div className='bg-white rounded-xl shadow-sm border p-8'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-bold text-gray-900'>Editor Login</h1>
            <p className='text-sm text-gray-500 mt-1'>
              Sign in to manage content
            </p>
          </div>

          {errorMessage && (
            <div className='flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-md p-3 mb-4'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='editor@example.com'
                value={email}
                className='mt-2'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='password'>Password</Label>
              <div className='relative mt-2'>
                <Input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  autoComplete='current-password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((s) => !s)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-[#FF9933] hover:bg-[#FF9933]/90'
            >
              {isLoading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                <LogIn className='w-4 h-4 mr-2' />
              )}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditorLogin;
