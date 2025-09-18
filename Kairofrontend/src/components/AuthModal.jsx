import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, BookOpen, Sparkles, Zap, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = isLogin 
        ? await onLogin({ username: formData.username, password: formData.password })
        : await onSignup(formData);

      if (result.success) {
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      } else {
        toast.error(result.error || 'Authentication failed');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-screen py-6 bg-gradient-to-br from-purple-950 via-purple-900 to-violet-900 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated Blurred Background Circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative max-w-md w-full z-10 animate-fadeInUp">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-4 shadow-xl shadow-purple-500/30 relative">
            <BookOpen className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Kairo</h1>
          <p className="text-purple-300 text-sm">Your intelligent note-taking companion</p>
        </div>

        {/* Auth Form */}
        <div className="bg-purple-950/60 backdrop-blur-xl rounded-2xl border border-purple-700/40 p-8 shadow-2xl shadow-purple-900/50">
          {/* Tab Switcher */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ml-2 ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-purple-900/40 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            {/* Email (only signup) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-purple-900/40 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-purple-900/40 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  minLength={isLogin ? 1 : 6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-purple-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-300 hover:text-white font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-6 text-purple-300">
            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 bg-purple-900/60 rounded-xl flex items-center justify-center mb-2 border border-purple-700 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-xs font-medium">Lightning Fast</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 bg-purple-900/60 rounded-xl flex items-center justify-center mb-2 border border-purple-700 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-xs font-medium">Smart Links</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 bg-purple-900/60 rounded-xl flex items-center justify-center mb-2 border border-purple-700 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-xs font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
