import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-obsidian-900 via-obsidian-800 to-obsidian-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Kairo</h1>
          <p className="text-obsidian-300">Your intelligent note-taking companion</p>
        </div>

        {/* Auth Form */}
        <div className="bg-obsidian-800/80 backdrop-blur-xl rounded-2xl border border-obsidian-700 p-8 shadow-2xl">
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin 
                  ? 'bg-primary-500 text-white' 
                  : 'text-obsidian-400 hover:text-white'
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
                  ? 'bg-primary-500 text-white' 
                  : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-obsidian-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-obsidian-700 border border-obsidian-600 rounded-lg text-white placeholder-obsidian-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-obsidian-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-obsidian-700 border border-obsidian-600 rounded-lg text-white placeholder-obsidian-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-obsidian-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-obsidian-700 border border-obsidian-600 rounded-lg text-white placeholder-obsidian-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  minLength={isLogin ? 1 : 6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

          <div className="mt-6 text-center text-sm text-obsidian-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-obsidian-400 text-xs">
            <div>📝 Rich Markdown</div>
            <div>🔗 Linked Notes</div>
            <div>🔔 Smart Reminders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;