import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaBus, FaPlane, FaTrain } from 'react-icons/fa';
import toast from 'react-hot-toast';

export function Navbar({ variant = 'landing', isLoggedIn = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const isHomePage = router.pathname === '/' || router.pathname === '/index';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(globalThis.scrollY > 50);
    };
    globalThis.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  // Landing page variant styles (home page)
  const landingClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-lg'
      : 'bg-transparent'
  }`;

  // Non-home page styles (light blue with enhanced styling)
  const nonHomeClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 ${
    isScrolled
      ? 'shadow-xl backdrop-blur-md border-b border-blue-400/30'
      : 'shadow-lg backdrop-blur-sm border-b border-blue-400/20'
  }`;

  return (
    <nav className={isHomePage ? landingClasses : nonHomeClasses}>
      {/* Glass shine effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex items-center justify-between px-8 py-4 mx-auto max-w-8xl md:px-16">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          TravelHub
        </h1>

        {isHomePage ? (
          <button className="px-5 py-2 font-semibold text-black transition bg-white rounded-full hover:bg-gray-200">
            Login
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <a href="/bus/busResults" className="flex items-center gap-2 text-white/90 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                <FaBus className="text-lg" />
                Bus
              </a>
              <a href="#" className="flex items-center gap-2 text-white/90 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                <FaPlane className="text-lg" />
                Flight
              </a>
              <a href="#" className="flex items-center gap-2 text-white/90 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                <FaTrain className="text-lg" />
                Train
              </a>
            </div>
            {isLoggedIn ? (
               <div className="flex items-center gap-4">
                <a href="#" className="text-white/90 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                  My Bookings
                </a>
                <a href="#" className="text-white/90 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                  Profile
                </a>
                <a href="#" className="text-white/90 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                  Notifications
                </a>
                <button
                  onClick={() => toast.success('Logged out successfully')}
                  className="px-4 py-1.5 font-medium rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button className="px-6 py-2 font-semibold text-blue-600 transition bg-white rounded-full hover:bg-gray-100 hover:shadow-lg">
                Login
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
