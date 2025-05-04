import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen font-sans antialiased">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
                ShadowHawk
              </h1>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-screen flex items-center justify-center">
          {children}
        </main>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} ShadowHawk. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout; 