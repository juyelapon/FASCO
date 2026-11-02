import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import registerBanner from '../assets/register-left.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup, googleSignIn } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  // ১. Email & Password দিয়ে Firebase Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Firebase-এ ইউজার ক্রিয়েট করা
      const userCredential = await signup(formData.email, formData.password);
      
      // ইউজারের নাম (DisplayName) আপডেট করা
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      console.error('Firebase Register Error:', error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('Invalid email address.');
      } else {
        setErrorMsg('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ২. Google Popup Sign-Up
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await googleSignIn();
      setSuccessMsg('Signed in with Google successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setErrorMsg('Google Sign-In failed. Please try again.');
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
        <div className="relative hidden md:block bg-neutral-100 min-h-[640px]">
          <img
            src={registerBanner}
            alt="FASCO Fashion"
            className="w-full h-full object-cover object-top"
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
              Create Account
            </h2>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-lg border border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition text-xs font-poppins font-medium text-gray-700 shadow-xs cursor-pointer disabled:opacity-50"
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
                <span>Sign up with Google</span>
              </button>

              <button
                type="button"
                onClick={() => setErrorMsg('Please fill out the form below to register with Email.')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-lg border border-red-200 hover:border-red-400 bg-white hover:bg-red-50/30 transition text-xs font-poppins font-medium text-gray-700 shadow-xs cursor-pointer"
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
                <span>Sign up with Email</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-5 text-gray-400 text-xs font-semibold tracking-widest font-poppins">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-2 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-2 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-2 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-2 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-2 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-300 py-2 text-sm font-poppins text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 px-4 bg-black text-white text-sm font-poppins font-semibold rounded-lg shadow-lg hover:bg-neutral-800 active:scale-[0.99] transition duration-200 cursor-pointer disabled:bg-gray-400"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Already have an account */}
            <div className="text-center mt-5">
              <p className="text-xs font-poppins text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Footer terms */}
          <div className="text-right mt-8 pt-4">
            <span className="text-[11px] font-poppins text-gray-800 font-medium tracking-tight">
              FASCO Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;