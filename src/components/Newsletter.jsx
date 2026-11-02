import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setShowToast(true);
    setEmail('');

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <section className="py-16 md:py-24 bg-white relative" ref={sectionRef}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-1/2 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg font-poppins text-sm"
          >
            Demo preview only — your email was not subscribed.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="hidden md:block w-1/4 flex-shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80"
              alt="Fashion model"
              className="w-full h-[400px] object-cover rounded-lg"
              loading="lazy"
            />
          </motion.div>

          {/* Center Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 text-center px-4 md:px-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Subscribe To Our Newsletter
            </h2>
            <p className="font-poppins text-gray-500 mb-8 max-w-md mx-auto">
              Get the latest fashion trends, exclusive deals, and style
              inspiration delivered straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-black text-white rounded-lg font-poppins text-sm font-medium hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="hidden md:block w-1/4 flex-shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80"
              alt="Fashion model"
              className="w-full h-[400px] object-cover rounded-lg"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
