import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowUp } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

import heroLeft from '../assets/figma/hero-left.png';
import heroCenterTop from '../assets/figma/hero-center-top.png';
import heroCenterBottom from '../assets/figma/hero-center-bottom.png';
import heroRight from '../assets/figma/hero-right.png';

const HeroSlider = () => {
  const { cartCount } = useCart();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white pt-4 pb-12 lg:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-center">
          {/* Left Column: Model sitting on wooden box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4 flex justify-center"
          >
            <div className="w-full max-w-[340px] md:max-w-none rounded-2xl overflow-hidden bg-[#e6e6e6] aspect-[3/4.6] flex items-end justify-center shadow-xs hover:shadow-md transition duration-300">
              <img
                src={heroLeft}
                alt="FASCO Men's Style"
                className="w-full h-full object-cover object-bottom hover:scale-103 transition duration-500"
              />
            </div>
          </motion.div>

          {/* Center Column: Top card + Typography + Bottom card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-4 flex flex-col justify-between space-y-4 lg:space-y-6"
          >
            {/* Top horizontal card */}
            <div className="w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-xs aspect-[16/6] max-h-[110px]">
              <img
                src={heroCenterTop}
                alt="FASCO Women Collection"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Middle Typography Banner */}
            <div className="text-center py-4 lg:py-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-none">
                ULTIMATE
              </h1>

              {/* Hollow Outlined SALE */}
              <div
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-wider my-1 uppercase select-none"
                style={{
                  WebkitTextStroke: '2px #262626',
                  color: 'transparent',
                }}
              >
                SALE
              </div>

              <p className="text-xs sm:text-sm font-poppins font-medium uppercase tracking-[0.25em] text-gray-600 mt-2 mb-6">
                NEW COLLECTION
              </p>

              <Link
                to="/shop"
                className="inline-block px-8 py-3.5 bg-black text-white text-xs font-poppins font-semibold tracking-wider rounded-lg shadow-lg hover:bg-neutral-800 active:scale-95 transition"
              >
                SHOP NOW
              </Link>
            </div>

            {/* Bottom horizontal card */}
            <div className="w-full rounded-2xl overflow-hidden bg-[#fca5a5]/30 shadow-xs aspect-[16/6] max-h-[110px]">
              <img
                src={heroCenterBottom}
                alt="FASCO Happy Moments"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </motion.div>

          {/* Right Column: Model on wooden stool */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-4 flex justify-center"
          >
            <div className="w-full max-w-[340px] md:max-w-none rounded-2xl overflow-hidden bg-[#e6e6e6] aspect-[3/4.6] flex items-end justify-center shadow-xs hover:shadow-md transition duration-300">
              <img
                src={heroRight}
                alt="FASCO Autumn Fashion"
                className="w-full h-full object-cover object-bottom hover:scale-103 transition duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Buttons on Right Edge matching Figma */}
      <div className="fixed right-5 bottom-8 z-40 flex flex-col items-center space-y-3">
        {/* Cart Quick Button */}
        <Link
          to="/cart"
          className="relative w-11 h-11 bg-black text-white rounded-lg flex items-center justify-center shadow-xl hover:bg-neutral-800 transition active:scale-95"
          aria-label="View Cart"
        >
          <FiShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Scroll Top Button */}
        <button
          type="button"
          onClick={handleScrollTop}
          className="w-11 h-11 bg-white text-black border border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition active:scale-95 cursor-pointer"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
