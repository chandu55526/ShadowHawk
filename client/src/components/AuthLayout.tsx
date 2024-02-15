import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">ShadowHawk</span>
              </Link>
            </div>
            <nav className="flex space-x-6">
              <Link to="/login" className="text-white/80 hover:text-white transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/signup" className="text-white/80 hover:text-white transition-colors duration-200">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/10 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/80 text-sm">
              © 2024 ShadowHawk. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout; 