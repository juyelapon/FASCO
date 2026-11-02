import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';

const instagramImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80',
    alt: 'Fashion photo 1',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
    alt: 'Fashion photo 2',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&q=80',
    alt: 'Fashion photo 3',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
    alt: 'Fashion photo 4',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80',
    alt: 'Fashion photo 5',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    alt: 'Fashion photo 6',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const InstagramSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-playfair text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
        >
          Follow Us On Instagram
        </motion.h2>

        {/* Image Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {instagramImages.map((image) => (
            <motion.a
              key={image.id}
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              {/* Image */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <FaInstagram className="text-white text-3xl md:text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-50" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;
