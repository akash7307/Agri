import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

import { 
  Mail, Lock, Loader2, AlertCircle, 
  CheckCircle2, Leaf, UserPlus, LogIn 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    if (!email) { setError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email'); return false; }
    if (!password) { setError('Password is required'); return false; }
    if (password.length < 6) { setError('Min 6 chars'); return false; }
    return true;
  };

  // Email/Password Auth Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;
        
        // Create User Profile in Firestore
        await setDoc(doc(db, 'users', currentUser.uid), {
          uid: currentUser.uid,
          email: currentUser.email,
          createdAt: new Date(),
          farmName: 'My Farm',
          location: { lat: 26.8467, lon: 80.9462 }
        });

        setSuccess('Account created! Welcome to AgriAI.');
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Welcome back!');
        toast.success('Logged in successfully!');
      }
      
      // Redirect to Dashboard after a short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
      toast.error(isSignUp ? 'Sign up failed' : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Social Auth - FIXED
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Direct popup call without any preceding awaits to prevent blocking
      await signInWithPopup(auth, googleProvider);
      
      toast.success('Google login successful!');
      navigate('/'); 
      
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed');
        toast.error('Google sign-in failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--cream)] overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[var(--leaf-light)] opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[var(--harvest)] opacity-10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-[var(--leaf)] rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-float">
            <Leaf className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--bark)] mb-2 font-['Playfair_Display']">AgriAI Portal</h1>
          <p className="text-gray-500 font-medium">Empowering Farmers with Intelligence</p>
        </div>

        <div className="glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-[var(--bark)] mb-6">
              {isSignUp ? 'Create New Account' : 'Sign In'}
            </h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`field-input pl-10 ${error && !email ? 'error' : ''}`}
                    placeholder="farmer@example.com"
                    disabled={isLoading || authLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  {!isSignUp && (
                    <button 
                      type="button" 
                      className="text-xs font-semibold text-[var(--leaf)] hover:underline"
                      onClick={() => toast('Password reset coming soon!')}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`field-input pl-10 ${error && !password ? 'error' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading || authLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 group"
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                    {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 px-2 text-gray-500 font-semibold backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
          
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[var(--leaf-mid)] opacity-5 rounded-full blur-2xl"></div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : 'New to AgriAI?'}
          {' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[var(--leaf)] font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Create an Account'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;