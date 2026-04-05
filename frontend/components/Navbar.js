import { useState, useEffect } from 'react';

export function Navbar({ variant = 'landing' }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Landing page variant styles
  const landingClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-lg'
      : 'bg-transparent'
  }`;

  // Dashboard variant styles
  const dashboardClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-lg'
      : 'bg-black/80 backdrop-blur-lg border-b border-white/5'
  }`;

  return (
    <nav className={variant === 'landing' ? landingClasses : dashboardClasses}>
      {/* Glass shine */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          TravelHub
        </h1>

        {variant === 'landing' ? (
          <button className="px-5 py-2 font-semibold text-black transition bg-white rounded-full hover:bg-gray-200">
            Login
          </button>
        ) : (
          <>
            <div className="flex items-center gap-4 text-white/90">
              <a href="#" className="hover:text-white">
                My Bookings
              </a>
              <a href="#" className="hover:text-white">
                Profile
              </a>
              <a href="#" className="hover:text-white">
                Notifications
              </a>
              <button
                onClick={() => alert('Logged out')}
                className="px-3 py-1 transition-colors rounded-md bg-white/20 hover:bg-white/30 text-white/90"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
