import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import loginBanner from '../assets/login-left.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, googleSignIn, resetPassword } = useAuth();
  const emailInputRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email or password is incorrect.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      default:
        return 'Unable to complete this request. Please try again.';
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await login(formData.email.trim(), formData.password);
      navigate('/shop');
    } catch (error) {
      console.error('Firebase sign-in failed:', error);
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await googleSignIn();
      navigate('/shop');
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Google sign-in failed:', error);
        setErrorMsg(getAuthErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email.trim()) {
      emailInputRef.current?.focus();
      setErrorMsg('Enter your email address first to reset your password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await resetPassword(formData.email.trim());
      setSuccessMsg('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Password reset failed:', error);
      setErrorMsg(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Fashion Model Image */}
        <div className="relative hidden md:block bg-neutral-100 min-h-[600px]">
          <img
            src={loginBanner}
            alt="FASCO Style"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Side: Form Content */}
        <div className="p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="mb-4">
              <Link to="/">
                <h1 className="font-playfair text-3xl lg:text-4xl font-extrabold tracking-wider text-black">
                  FASCO
                </h1>
              </Link>
            </div>

            {/* Subtitle */}
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Sign In To FASCO
            </h2>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-lg border border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition text-xs font-poppins font-medium text-gray-700 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => emailInputRef.current?.focus()}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-lg border border-red-200 hover:border-red-400 bg-white hover:bg-red-50/30 transition text-xs font-poppins font-medium text-gray-700 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 5H21C21.55 5 22 5.45 22 6V18C22 18.55 21.55 19 21 19H3C2.45 19 2 18.55 2 18V6C2 5.45 2.45 5 3 5Z"
                    stroke="#EA4335"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L12 13L2 6"
                    stroke="#EA4335"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Continue with Email</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-6 text-gray-400 text-xs font-semibold tracking-widest font-poppins">
              <span>—</span>
              <span>OR</span>
              <span>—</span>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="mb-4 text-xs font-poppins text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 text-xs font-poppins text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-200">
                {successMsg}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-300 py-2.5 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-300 py-2.5 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                />
              </div>

              {/* Forget Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="text-xs font-poppins text-blue-600 hover:text-blue-800 hover:underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Forget Password?
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-black text-white text-sm font-poppins font-semibold rounded-lg shadow-md hover:bg-neutral-800 active:scale-[0.99] transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : 'Sign In'}
                </button>

                <Link
                  to="/register"
                  className="w-full block text-center py-3 px-4 bg-white text-blue-600 border border-blue-400/80 hover:bg-blue-50/50 text-sm font-poppins font-medium rounded-lg transition duration-200"
                >
                  Register Now
                </Link>
              </div>
            </form>
          </div>

          {/* Footer terms */}
          <div className="text-right mt-10 pt-4">
            <span className="text-[11px] font-poppins text-gray-800 font-medium tracking-tight">
              FASCO Terms & Codnitions
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
