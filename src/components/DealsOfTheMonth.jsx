import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import deal1 from '../assets/figma/deal-1.png';
import deal2 from '../assets/figma/deal-2.png';
import deal3 from '../assets/figma/deal-3.png';

const dealSlides = [
  {
    id: 1,
    image: deal1,
    tag: '01 — Spring Sale',
    discount: '30% OFF',
    title: 'Off-shoulder Cocktail Dress',
  },
  {
    id: 2,
    image: deal2,
    tag: '02 — Summer Chic',
    discount: '25% OFF',
    title: 'Blue Ruffle Two-Piece',
  },
  {
    id: 3,
    image: deal3,
    tag: '03 — Street Elegant',
    discount: '40% OFF',
    title: 'Casual Crop & Jacket',
  },
];

const loopingDealSlides = [...dealSlides, ...dealSlides];

const DealsOfTheMonth = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Digital Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 6,
    mins: 5,
    secs: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="deals" className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Details & Countdown */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-gray-900 leading-tight mb-4">
              Deals Of The Month
            </h2>

            <p className="font-poppins text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
              duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
              sollicitudin
            </p>

            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-black text-white text-xs font-poppins font-medium rounded-lg shadow-md hover:bg-neutral-800 transition mb-8 active:scale-95"
            >
              Buy Now
            </Link>

            {/* Sub-heading */}
            <h3 className="font-poppins font-semibold text-gray-900 text-sm sm:text-base mb-4">
              Hurry, Before It’s Too Late!
            </h3>

            {/* Countdown Boxes matching Figma */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              {[
                { val: String(timeLeft.days).padStart(2, '0'), label: 'Days' },
                { val: String(timeLeft.hours).padStart(2, '0'), label: 'Hr' },
                { val: String(timeLeft.mins).padStart(2, '0'), label: 'Mins' },
                { val: String(timeLeft.secs).padStart(2, '0'), label: 'Sec' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-gray-200/90 shadow-sm flex items-center justify-center bg-white font-poppins font-semibold text-xl sm:text-2xl text-gray-800">
                    {item.val}
                  </div>
                  <span className="text-[11px] font-poppins text-gray-500 mt-1.5 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Circular Arrows for Swiper navigation */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center hover:bg-gray-100 transition active:scale-95 text-gray-700 cursor-pointer"
                aria-label="Previous Deal"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-xs flex items-center justify-center hover:bg-gray-100 transition active:scale-95 text-gray-700 cursor-pointer"
                aria-label="Next Deal"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Deals Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 2.2 },
              }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) =>
                setActiveIndex(swiper.realIndex % dealSlides.length)
              }
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              className="deal-swiper !pb-8"
            >
              {loopingDealSlides.map((slide, index) => (
                <SwiperSlide key={`${slide.id}-${index}`}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4.2] bg-neutral-100 shadow-sm group">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition duration-500"
                    />

                    {/* White Tag Box at Bottom-Left matching Figma */}
                    {slide.tag && (
                      <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-xs p-4 rounded-xl shadow-lg border border-gray-100">
                        <p className="text-[11px] font-poppins text-gray-500 font-medium mb-0.5">
                          {slide.tag}
                        </p>
                        <h4 className="text-xl font-bold font-poppins text-gray-900 leading-tight">
                          {slide.discount}
                        </h4>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Dot Indicators matching Figma */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {dealSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === i
                      ? 'w-3 h-3 bg-black'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheMonth;
