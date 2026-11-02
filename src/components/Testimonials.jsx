import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import avatarJames from '../assets/figma/avatar-james.png';
import avatarWoman from '../assets/figma/avatar-woman.png';

const testimonialsList = [
  {
    id: 1,
    name: 'James K.',
    role: 'Traveler',
    avatar: avatarJames,
    rating: 5,
    quote:
      "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
  },
  {
    id: 2,
    name: 'Sarah M.',
    role: 'Creative Director',
    avatar: avatarWoman,
    rating: 5,
    quote:
      "I've been shopping with FASCO for over a year. The fabrics are exceptional and the fit is tailored to perfection every time.",
  },
  {
    id: 3,
    name: 'Robin W.',
    role: 'Fashion Blogger',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    rating: 5,
    quote:
      "The exact aesthetic and contemporary elegance I was looking for. Thank you for making luxury hassle-free!",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialsList.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonialsList.length - 1 ? 0 : prev + 1
    );
  };

  const current = testimonialsList[currentIndex];
  const prevIndex =
    currentIndex === 0 ? testimonialsList.length - 1 : currentIndex - 1;
  const nextIndex =
    currentIndex === testimonialsList.length - 1 ? 0 : currentIndex + 1;

  const prevItem = testimonialsList[prevIndex];
  const nextItem = testimonialsList[nextIndex];

  return (
    <section className="py-20 md:py-28 bg-[#fafafa] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4"
          >
            This Is What Our Customers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-poppins text-xs sm:text-sm text-gray-500"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
          </motion.p>
        </div>

        {/* 3D / Layered Carousel matching Figma */}
        <div className="relative flex items-center justify-center max-w-5xl mx-auto min-h-[300px]">
          {/* Left Inactive Card */}
          <div
            onClick={handlePrev}
            className="hidden lg:flex items-center gap-4 bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-sm opacity-40 scale-90 cursor-pointer absolute -left-12 z-0 max-w-md pointer-events-auto hover:opacity-70 transition"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-gray-200 rounded-lg -z-10" />
              <img
                src={prevItem.avatar}
                alt={prevItem.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-poppins text-gray-500 line-clamp-2">
                {prevItem.quote}
              </p>
              <div className="flex text-amber-400 text-xs my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <h4 className="font-playfair font-bold text-sm text-gray-900">
                {prevItem.name}
              </h4>
            </div>
          </div>

          {/* Center Elevated Active Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100/90 max-w-2xl w-full z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
            >
              {/* Avatar with Offset Box matching Figma */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
                {/* Gray Offset Layer */}
                <div className="absolute inset-0 -translate-x-2.5 translate-y-2.5 bg-gray-200 rounded-xl -z-10" />
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-full h-full object-cover rounded-xl shadow-xs"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center sm:text-left">
                <p className="font-poppins text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  &ldquo;{current.quote}&rdquo;
                </p>

                {/* 5 Stars */}
                <div className="flex justify-center sm:justify-start text-amber-400 text-sm mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-gray-200 my-3" />

                {/* Author */}
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900">
                  {current.name}
                </h3>
                <p className="font-poppins text-xs text-gray-400 mt-0.5">
                  {current.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Inactive Card */}
          <div
            onClick={handleNext}
            className="hidden lg:flex items-center gap-4 bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-sm opacity-40 scale-90 cursor-pointer absolute -right-12 z-0 max-w-md pointer-events-auto hover:opacity-70 transition"
          >
            <div className="flex-1 truncate text-left">
              <p className="text-xs font-poppins text-gray-500 line-clamp-2">
                {nextItem.quote}
              </p>
              <div className="flex text-amber-400 text-xs my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <h4 className="font-playfair font-bold text-sm text-gray-900">
                {nextItem.name}
              </h4>
            </div>
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-gray-200 rounded-lg -z-10" />
              <img
                src={nextItem.avatar}
                alt={nextItem.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Circular Arrow Navigation Buttons matching Figma */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center hover:bg-gray-100 transition active:scale-95 text-gray-700 cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center hover:bg-gray-100 transition active:scale-95 text-gray-700 cursor-pointer"
            aria-label="Next Testimonial"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
