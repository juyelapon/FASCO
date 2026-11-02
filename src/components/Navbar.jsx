import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const accountMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const wishlistCount = wishlistItems?.length || 0;
  const accountName = user?.displayName || user?.email || 'My account';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return undefined;
    const sectionId = decodeURIComponent(location.hash.slice(1));
    let frameId;
    let active = true;
    const scrollWhenReady = () => {
      if (!active) return;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      frameId = window.requestAnimationFrame(scrollWhenReady);
    };
    frameId = window.requestAnimationFrame(scrollWhenReady);
    return () => {
      active = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setAccountMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [accountMenuOpen]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Firebase sign-out failed:', error);
      setLogoutError('Unable to sign out. Please try again.');
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
          isScrolled ? 'shadow-xs py-3.5' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="font-playfair text-3xl md:text-4xl font-extrabold tracking-wider text-gray-900">
                FASCO
              </span>
            </Link>

            {/* Desktop Navigation Links matching Figma */}
            <div className="hidden md:flex items-center space-x-7 lg:space-x-10 text-[13px] font-poppins text-gray-700">
              <Link
                to="/"
                className="hover:text-black transition-colors duration-200"
              >
                Home
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection('deals')}
                className="hover:text-black transition-colors duration-200 cursor-pointer"
              >
                Deals
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('new-arrivals')}
                className="hover:text-black transition-colors duration-200 cursor-pointer"
              >
                New Arrivals
              </button>

              <Link
                to="/shop"
                className="hover:text-black transition-colors duration-200"
              >
                Packages
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="hover:text-black transition-colors duration-200"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Right Action: Sign Up Button & Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 hover:text-black transition"
                aria-label="Wishlist"
              >
                <FiHeart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-black transition"
                aria-label="Cart"
              >
                <FiShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoutError('');
                      setAccountMenuOpen((isOpen) => !isOpen);
                    }}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 text-gray-700 transition hover:border-black hover:text-black"
                    aria-label={`Account menu for ${accountName}`}
                    aria-controls="account-menu"
                    aria-expanded={accountMenuOpen}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FiUser className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>

                  <AnimatePresence>
                    {accountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        id="account-menu"
                        className="absolute right-0 top-full z-[60] mt-3 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
                      >
                        <div className="border-b border-gray-100 px-3 py-2.5">
                          <p className="truncate text-sm font-semibold text-gray-900">{accountName}</p>
                          {user.email && user.displayName && (
                            <p className="mt-0.5 truncate text-xs text-gray-500">{user.email}</p>
                          )}
                        </div>
                        <Link
                          to="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black"
                        >
                          <FiHeart aria-hidden="true" />
                          My Wishlist
                          {wishlistCount > 0 && <span className="ml-auto text-xs text-gray-500">{wishlistCount}</span>}
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black"
                        >
                          <FiShoppingBag aria-hidden="true" />
                          Shopping Cart
                          {cartCount > 0 && <span className="ml-auto text-xs text-gray-500">{cartCount}</span>}
                        </Link>
                        {logoutError && (
                          <p className="px-3 py-2 text-xs text-red-600" role="alert">{logoutError}</p>
                        )}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <FiLogOut aria-hidden="true" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-black text-white text-xs font-poppins font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition"
                >
                  Sign Up
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-800"
                aria-label="Open menu"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] overflow-y-auto bg-white z-50 p-6 flex flex-col justify-between shadow-xl md:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <span className="font-playfair text-2xl font-bold">FASCO</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-gray-500"
                  >
                    <FiX size={22} />
                  </button>
                </div>

                <div className="flex flex-col space-y-4 py-6 text-sm font-poppins">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 text-gray-700"
                  >
                    Home
                  </Link>
                  <button
                    onClick={() => scrollToSection('deals')}
                    className="text-left py-1 text-gray-700"
                  >
                    Deals
                  </button>
                  <button
                    onClick={() => scrollToSection('new-arrivals')}
                    className="text-left py-1 text-gray-700"
                  >
                    New Arrivals
                  </button>
                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 text-gray-700"
                  >
                    Packages
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 text-gray-700"
                  >
                    About Us
                  </Link>
                  {!user && (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1 text-gray-700 font-semibold"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>

              <div>
                {user ? (
                  <div className="space-y-3">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="truncate text-sm font-semibold text-gray-900">{accountName}</p>
                      {user.email && user.displayName && (
                        <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
                      )}
                    </div>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-1 text-sm text-gray-700"
                    >
                      <FiHeart aria-hidden="true" /> My Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-1 text-sm text-gray-700"
                    >
                      <FiShoppingBag aria-hidden="true" /> Shopping Cart
                    </Link>
                    {logoutError && <p className="text-xs text-red-600" role="alert">{logoutError}</p>}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-xs font-semibold text-white"
                    >
                      <FiLogOut aria-hidden="true" /> Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-center bg-black text-white text-xs font-semibold rounded-lg"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
